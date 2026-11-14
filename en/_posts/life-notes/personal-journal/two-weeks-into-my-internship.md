---
translation_id: internship-first-two-weeks
tags:
  - Internship
  - Spring Boot
  - MyBatis
categories: ["Life", "Journal"]
source_digest: bd2f2729ed312f8a362e35184aebd9719c3c9b08c84456d185c0690a65bb35bc
title: Two Weeks into My Internship
sections: {"starting-out": "最开始", "what-came-next": "然后", "where-i-am-now": "现在"}
---

I’ve spent two weeks working on the Spring Boot backend at a company in Hangzhou. I’ve found plenty of gaps in what I know, and a few things worth writing down.

---

When I started the job, I was pretty new to Spring Boot. I knew a few basics, and I’d never even used MyBatis...

At first I tried writing endpoints on my own, working from a template. Then I’d look at my coworkers’ code and go back and revise mine. By now I’d say I’ve more or less got the hang of writing basic CRUD endpoints.

I keep coming across ways to write the same thing that feel easier or more flexible. I suspect they each suit different situations, and sometimes it makes sense to use them together.

## Starting out

First I learned to do CRUD operations with MyBatis. I could write the SQL in an XML file:

```xml
<select id="function_name" resultType="java.util.Map">
    select * from table_name
</select>
```

Or put an annotation directly above a method in the DAO layer:

```java
@Select("select * from table_name")
// or
@Insert("insert into table_name (id, field_name) values (#{id}, #{function_variable_name})")
```

## What came next

Then I discovered MyBatis-Plus. Its generic service interface, `IService`, and mapper interface, `BaseMapper`, give you quite a few CRUD methods you can call without writing SQL:

```java
public interface ServiceName extends IService<EntityName> {}
public class ServiceImplName extends ServiceImpl<DaoName, EntityName>
        implements ServiceName {}
// and
@Mapper
public interface DaoName extends BaseMapper<EntityName> {}
```

For queries, I still had to build the conditions with a `QueryWrapper`:

```java
QueryWrapper<EntityName> queryWrapper = new QueryWrapper<>();
queryWrapper.eq(String column, Object val);
```

## Where I am now

Now I know I can combine the two approaches.

For something simple, like reading data from a few tables, I can write the query directly in XML or use an annotation.

When I need CRUD operations, I use the generic types from MyBatis-Plus. If I need something they don’t provide, I can extend what’s already there:

- Add the corresponding method to the service layer.
- If it needs to talk to the database, add a method to the DAO layer.

---

A few other things I’ve picked up along the way:

- Put constants and shared routines in the relevant `Common...` helpers so they’re ready to use wherever they’re needed.
- It’s worth looking through `utils`. Chances are some of the things I need already exist there.

  There’s `Result` for endpoint return values, `FileUpload` for uploads, `PageUtils` for pagination, `UserInfoUtil` for getting the user ID...

  The names might differ from project to project, but the jobs are much the same. I don’t have to write them all myself.
- ...

Back to learning. Maybe one day I’ll write clean, simple code.
