---
title: OneDrop storage and multi-device sync (part two)
translation_id: onedrop-storage-sync-2
source_digest: 5f731f8aa55a0c73906f84d3c018eef67a2e8a7f60cfa7efad5d9c5ffd5aed5c
tags:
  - OneDrop
  - OneDrive
  - TypeScript
  - Microsoft Graph
  - Edge Extension Development
categories:
  - Software Development
  - App Development
sections: {"synchronisation-conflicts-and-archives": "多设备同步-冲突与归档", "reading-messages-and-using-the-cache": "消息同步与缓存", "when-a-client-syncs": "触发同步的时机", "reading-a-month-and-reusing-cached-chunks": "按月份读取与复用缓存", "following-an-upload-in-progress": "跟进上传状态", "loading-earlier-messages": "加载历史消息", "etags-and-concurrent-writes": "etag-与并发写入", "check-the-version-and-retry": "检查版本并重试写入", "network-failures-and-local-write-ordering": "网络异常与本地写入顺序", "chunking-and-damaged-records": "消息分块与异常处理", "choosing-a-chunk": "分块大小与追加位置", "corruption-and-conflicting-contents": "损坏记录与内容冲突", "archiving-history": "历史消息归档", "building-and-verifying-the-archive": "生成归档与校验内容", "retries-and-timeout-reporting": "失败重试与超时处理", "source-cleanup-and-recovery-limits": "清理源目录与恢复限制", "deletion-recovery-and-physical-cleanup": "删除-恢复与物理清理", "tombstones-and-retention": "删除标记与保留策略", "the-recycle-bin-and-restoring-messages": "回收站与消息恢复", "cleaning-up-expired-data": "过期数据清理", "selecting-eligible-items": "筛选待清理记录", "checking-references-and-deleting-in-order": "核对引用并依次删除"}
---

[Part one](/en/软件开发/应用开发/OneDrop%20的消息存储与多端同步（上）/) covered authorisation, the storage layout and file transfers. What happens after a message has been saved? This part follows it through concurrent edits, history, deletion and recovery. The implementation described here is still [OneDrop 1.0.3](https://github.com/zixu0779/OneDrop/releases/tag/v1.0.3).

---

## Synchronisation, conflicts and archives

### Reading messages and using the cache

#### When a client syncs

Clients pull changes when the interface opens, comes to the foreground, refreshes manually or needs to read data as part of sending. There’s no server of mine continually pushing updates. Once the browser closes, you can’t treat it as an always-online messenger.

On returning to the foreground, the UI checks the time since the previous sync. This avoids rereading the month every time you switch windows. Normal mode checks after 30 seconds, Reduce mode after five minutes. Manual mode doesn’t trigger a sync from this foreground check.

#### Reading a month and reusing cached chunks

The client lists files under `messages/YYYY-MM`, requests 200 items per page, follows `@odata.nextLink` and reads the chunks in numerical order. The 200-item limit applies to a single listing request. It doesn’t limit the number of messages or chunks in the month. A missing monthly directory is a valid empty state; a failed request is an error. Pagination URLs are checked against the expected Graph API scope.

The cache stores more than the merged list. For each chunk it retains the DriveItem ID, ETag, parsed document and message line numbers. An ETag identifies the version returned by the server. If the version matches and line information is present, the cached document can be reused. Changed chunks are downloaded and parsed, up to three at once. A growing history doesn’t mean downloading every JSON body on every refresh. In the code below, a matching version and complete line information let OneDrop reuse the local record. Otherwise it calls `downloadDocument()`.

```typescript
const downloaded =
  cached?.eTag === item.eTag && cached.messageLines
    ? { document: cached.document, messageLines: cached.messageLines }
    : await downloadDocument(item.id, month, accessToken);
```

After parsing, OneDrop merges by ID, sorts by `createdAt` and ID, and applies deletion markers from `tombstones`. Identical records with the same ID collapse to one. Different contents for a single ID produce a conflict record with source files and line numbers so the choice can be resolved later.

#### Following an upload in progress

Part one introduced the `file-uploading` placeholder. Other devices can see it before the attachment finishes. To pick up the final file message promptly, the visible, signed-in UI polls after waits of 2, 5, 8 and 10 seconds, then continues at 10-second intervals. Once the accumulated waits reach 120 seconds it ends the round and marks outstanding placeholders unresponsive. That total counts time spent waiting between requests, excluding the requests themselves.

If the attachment is already stored and the local record is `committing`, the client retries the final message on the same schedule, stopping at the round limit. An `online` event attempts those commits again and cleans up placeholders left by failed uploads. This work resumes from local state when the client is running or connectivity returns.

#### Loading earlier messages

Scrolling back expands more batches within the loaded months and fetches one earlier UTC month. Each read carries a request version and a local write version; the client checks both before applying the response so a stale read can’t overwrite a newer local action. It also remembers a visible message as a scroll anchor. When older items arrive above it, the message you were reading stays in view.

### ETags and concurrent writes

Reads can merge several chunks, but a write has to protect each chunk against concurrent changes. Suppose A and B both read version `v1`. A adds a message and writes successfully. If B now writes back a full JSON document built from its old copy, it can erase A’s message.

#### Check the version and retry

When updating an existing chunk, OneDrop sends the ETag it read in `If-Match`. The server accepts the write only if the version still matches. After A’s update, B’s condition no longer holds.

![Two devices detect a stale write and merge again](https://res.cloudinary.com/sycamore/image/upload/v1793212425/Typora/2026/10/29/onedrop-tech-conflict.png)

A changed file can produce `412 Precondition Failed`; competing object creation can produce `409 Conflict`. For these responses OneDrop invalidates the cache and retries from the cloud:

```typescript
if (response.status === 409 || response.status === 412) {
  await deleteMonthCache(month);
  snapshot = undefined;
  continue;
}
```

The next iteration reads a fresh snapshot, merges by message ID and decides where to write. If the ID is already present it returns the existing result, avoiding a duplicate append on a retried send. After five unsuccessful rounds it reports the conflict so the caller can retain the failure state.

A new chunk has no previous ETag, so OneDrop asks Graph to fail if the name already exists. If two devices both try to create `0002.json`, one succeeds. The other rereads the month before deciding where to write.

If a directory has been deleted and Graph returns 404, OneDrop clears the corresponding cache and tries to locate the directory again.

#### Network failures and local write ordering

A network error has different semantics. The server may have committed the request even if the client never received its response. The write function invalidates the cache and reports the error without automatically replaying the write. A subsequent sync or explicit retry can inspect the message ID to determine what happened.

Within one runtime, a Promise queue serialises modifications to monthly messages. Operations across devices still depend on server-side conditional writes. Keeping the queue at the message-write layer also means a large attachment needn’t block text messages for the entire duration of its upload.

### Chunking and damaged records

#### Choosing a chunk

A single ever-growing monthly JSON file would make every append more expensive. OneDrop tries the last active chunk first. If the proposed append exceeds the 256 KiB soft limit, it starts a new chunk. The final document has a separate 320 KB hard limit, and chunk numbers stop at 9999. Exceeding those limits is an error; reaching the numbering limit seems unlikely for message metadata alone.

The soft limit decides when to roll over. The hard limit applies to every final chunk, including a new one or an existing one after a placeholder is replaced. Older chunks remain readable. Committing a file message requires finding the chunk that contains its placeholder, regardless of which chunk is now last.

![Choosing the append target and checking the final size](https://res.cloudinary.com/sycamore/image/upload/v1793289728/Typora/2026/10/29/onedrop-tech-message-chunk-selection.png)

#### Corruption and conflicting contents

A read can collect malformed JSON and conflicting records while still displaying the readable remainder. A strict read aborts. Treating invalid JSON as an empty list would lose the distinction between damaged and genuinely empty data.

An ordinary append can proceed while leaving a damaged file untouched. The next chunk number accounts for damaged chunks so their paths won’t be reused. After rereading the remote month, a known conflict for the target message ID blocks the write. The cached fast path means there isn’t a complete remote conflict scan before every write. Archiving is stricter: any damaged source file or conflicting message blocks consolidation.

When two versions have the same ID, silently keeping the last one read could discard the other version. Instead, the user chooses which source to retain. `resolveMessageConflict()` removes the record from the other source chunks with ETag checks. If another device edits a source in the meantime, the user must recheck it before the earlier decision can be applied.

### Archiving history

#### Building and verifying the archive

Once a UTC month has been over for more than 24 hours, OneDrop can consolidate it into `archive/YYYY-MM.json`. The delay gives end-of-month writes some breathing room. Subsequent history reads can then fetch fewer files. Eligible history reads try the archive first. If there is no archive, the read fails, or it takes more than eight seconds, they fall back to the source chunks. Current tombstones apply to archive reads too.

Creation uses `conflictBehavior=fail` so an existing archive won’t be overwritten. After writing, OneDrop reads it back and compares the serialised result with the intended document. If an archive already exists, its contents must match the visible source month. Damaged files, unresolved messages or an inconsistent existing archive leave the task blocked.

#### Retries and timeout reporting

Task state is persisted locally. `cooling-down` waits for the next retry, `auth-paused` waits for authorisation, `blocked` needs a data problem resolved, and `succeeded` records success. Ordinary retries wait five minutes, thirty minutes, six hours and then twenty-four hours. Reopening the interface doesn’t immediately repeat a task known to be failing.

After thirty seconds the task can report a timeout. That notification doesn’t cancel the underlying operation. The client still waits for its actual outcome, so a later success can update the task state.

#### Source cleanup and recovery limits

A successful archive leaves the monthly source directory in place initially. The task saves a digest of the archive and sets `cleanupPending`. Cleanup rereads the raw archive and checks that digest before trying to remove the source directory. A failed cleanup can be retried independently.

![Checking the saved digest before removing the source directory](https://res.cloudinary.com/sycamore/image/upload/v1793271806/Typora/2026/10/29/onedrop-tech-archive-check.png)

The check returns early if the archive is missing, there’s no saved digest, or the digest no longer matches. There is a limitation here: the digest verifies the archive, but the implementation doesn’t check that the **source** still matches its archived version immediately before deletion. Another device could have changed the source since the archive was created.

The archive also contains visible messages after tombstone filtering. It doesn’t preserve every original deleted record. Cleaning the source directory can therefore remove the only remaining recovery source for a deleted message. Recovery has to check what still exists.

## Deletion, recovery and physical cleanup

### Tombstones and retention

Removing a message from a local array would let the next sync bring it back. Removing it from one chunk still leaves the possibility of a stale writer. OneDrop records deletion separately as a tombstone, and all read paths apply the same deletion state.

A tombstone records `messageId`, `originalMonth`, `deletedAt` and optionally `recovery`. It’s saved by original month in `tombstones/YYYY-MM.json`. Monthly and archive reads filter the matching IDs. Hiding a message therefore doesn’t require its attachment and original JSON to disappear at the same instant. The monthly read below fetches the set of deleted IDs and excludes them from the merged result. It leaves the source files in place.

```typescript
const deletedMessageIds = await readTombstoneIds(month, accessToken);
const messages = unfilteredMessages.filter(
  (message) => !deletedMessageIds.has(message.id),
);
```

![From deletion marker through recovery or staged cleanup](https://res.cloudinary.com/sycamore/image/upload/v1793212428/Typora/2026/10/29/onedrop-tech-deletion.png)

Updating and removing tombstones also use read, merge and conditional write, with up to five attempts on conflict. Otherwise deleting one message on A could overwrite a deletion marker B had just added for a different message.

The deletion action records its recovery policy: disabled, 3, 7, 10 or 30 days, or forever. Finite retention can include an explicit `recoverableUntil`. For older records without the information, cleanup falls back to ten days after deletion. Disabling recovery makes the record eligible immediately; remote objects still go through the cleanup process.

### The recycle bin and restoring messages

A tombstone stores deletion state, not a full copy of the text or attachment. For the recycle bin, OneDrop reads the raw archive and unfiltered records in the source chunks, merges them and looks for the matching ID. A hidden message can appear there while its original content remains available.

Identical records can merge. Contradictory versions with the same ID don’t count as one unambiguously recoverable message. If the source is gone, the client doesn’t construct a placeholder from the tombstone and present it as recoverable.

Restore checks the tombstone and original again, removes the marker, then clears the monthly cache. If either the tombstone or the original is missing, the restore function returns an error here. Otherwise, the next normal read includes the message. There’s no new message ID or attachment upload.

![Verifying both sources before removing the tombstone](https://res.cloudinary.com/sycamore/image/upload/v1793271803/Typora/2026/10/29/onedrop-tech-message-restore.png)

Retention defines cleanup eligibility; it isn’t an independent backup. A manually removed original or a source lost during archive cleanup can’t be reconstructed from an ID. Even an intact file message doesn’t guarantee the attachment is still there: external operations can move or delete it.

### Cleaning up expired data

#### Selecting eligible items

A separate cleanup process removes remote attachments and metadata. Automatic scans run at 24-hour intervals and inspect up to twenty eligible items per round. A manual cleanup skips the normal interval, expiry wait and ordinary round limit. Automatic scans skip permanent retention; disabled recovery is eligible from deletion time. The code below calculates the earliest cleanup time as `eligibleAt`. Automatic scans skip records that haven’t reached it, while manual cleanup skips that time check.

![Checking eligibleAt against the recovery policy](https://res.cloudinary.com/sycamore/image/upload/v1793289744/Typora/2026/10/29/onedrop-tech-cleanup-retention.png)

Before deleting anything, the client reads the source and checks the month implied by the message timestamp. If it can’t identify the record uniquely, it stops processing that item. An absent record alongside a damaged file warrants investigation: an empty set of successfully parsed records doesn’t prove cleanup is complete.

#### Checking references and deleting in order

For a file message, the client checks whether another undeleted message in the **currently read month** refers to the same `driveItemId`. If it does, it keeps the attachment. Otherwise it locates `files/year/month/message-ID`, verifies that it’s a folder containing the target DriveItem, and only then deletes that attachment folder. This check doesn’t build a global reference index over all of OneDrive.

After handling the attachment it removes metadata from message chunks or the archive. JSON rewrites use ETags. A change or conflict defers the operation and leaves the tombstone for later. The marker is removed last, once the metadata step is confirmed, and the item is marked complete.

An intermediate state is possible: the attachment is gone but a conditional metadata update hasn’t succeeded yet. A local maintenance queue serialises restore and cleanup on one device; it doesn’t lock every device. A subsequent restore must still recheck its sources.

Two other cases are worth distinguishing. A failed local send that never reached the cloud can be removed from IndexedDB after confirmation, without creating a cloud tombstone. A file the user has already downloaded to a system directory is their own copy. Cleaning up its message or deleting its download registration doesn’t delete that local file.
