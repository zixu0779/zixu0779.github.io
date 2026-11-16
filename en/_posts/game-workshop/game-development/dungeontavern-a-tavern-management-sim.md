---
title: "DungeonTavern: A Tavern Management Sim"
translation_id: dungeontavern-intro
source_digest: a3fb01b660c2068ab1f84bb59d3d1f6ffaff26b8eedd280f01b5219cf99c7385
tags: ["DungeonTavern", "Unity"]
categories: ["Game Workshop", "Game Development"]
sections: {"how-the-project-started": "项目由来", "the-world-and-its-history": "世界观和背景", "serving-customers-and-talking-to-them": "经营与交谈", "whats-playable-in-the-demo": "demo-的完成情况"}
---

[DungeonTavern](https://github.com/zixu0779/DungeonTavern) is a 2.5D tavern management demo built in Unity. You run a tavern inside a dungeon. The idea is that serving customers moves the story forward and unlocks new things to do.
The demo currently includes a simplified way to serve customers, the first day’s story and the main areas of the tavern.

## How the project started

The idea came from an AI-made series I saw on Bilibili called [《地牢酒馆》 (Dungeon Tavern)](https://space.bilibili.com/3546606836124333/lists/8116225).
I liked the premise and started building my own world around it. With a tavern at the center of the game, it felt natural to put the player in charge of running it.

The tavern occupies a quiet corner of the dungeon’s first floor. Adventurers stop by, and so do the people who live in the dungeon. Everyone comes through the same door, orders from the same menu board and can end up sharing a table.

![The tavern during service, with customers at the menu board and tables](https://res.cloudinary.com/sycamore/image/upload/v1794836708/Typora/2026/11/16/dungeon-tavern-hall.png)

Eve, who works at the tavern, sums up the house rules: “We don’t ask where you came from, and no one gets to hurt anyone here.”
People who might fight if they met outside all become customers for the player to look after. What happens between them at the tavern gives the story somewhere to go.

## The world and its history

The dungeon’s first floor saw a long period of fighting. The owner, whom you play in the game, later opened his tavern in a quiet corner of that floor and laid down rules to keep the peace.
Adventurers and dungeon residents use the same door, order at the same bar, and can sit at the same table. They can carry ordinary weapons inside, but hostile magic has no effect. Anyone who starts a fight is bound before they can hurt someone. Serious offenders are barred for good.

The usual routes to the deeper levels were sealed off, leaving a single controlled passage beneath the tavern.
The owner once used a power inspired by the [*Wish* spell](https://www.dndbeyond.com/spells/2619213-wish) in *Dungeons & Dragons* to reshape reality. Together with several layers of wards, rare anchor crystals and a control core, that act formed the main seal. He has been unable to cast *Wish* normally ever since.
People of any race could use the passage for approved purposes such as trade or gathering resources. Residents of the deeper levels used it most often. The core checked why each traveler was passing through, so it was perfectly ordinary for goods from the depths to turn up on the market.

What gave the game away was a batch described as “old stock.” **The material could only have come from killing a protected, peaceful creature, and it was fresh.**
Before he disappeared, the owner placed an order with a merchant named Nox to find out where it came from. Someone had obtained a unique relic from a small ruin deep in the dungeon. It allowed them to bypass the core’s check on a traveler’s purpose.
One of the NPCs, Mira, has a piece of black stone from the same ruin. It was another remnant found there, separate from the relic itself.

The owner was attacked while investigating. He fled back to the tavern and reset the main seal in an emergency to lock the passage completely. It cost him **his memories of the sealing incident**, though he kept the power to protect the tavern.
At the start of the game, he wakes up lying face down on the floor of the seal room beneath the tavern, still wearing the clothes torn in the attack.
As the player, you take charge of a tavern the owner built himself. The regulars all know the house rules, yet the owner himself can no longer remember a crucial part of its history.

## Serving customers and talking to them

There’s a lever beside the bar. Pull it and the camera turns toward the entrance. The doors open, the sign turns over, and the first customers come in.

![Pulling the lever opens the doors and turns the sign from Closed to Open](https://res.cloudinary.com/sycamore/image/upload/v1794841962/Typora/2026/11/16/dungeon-tavern-opening.gif)

Customers queue at the menu board and choose their dishes automatically when it’s their turn. Once the order is recorded on the menu, they take their seats. Customers who arrive together can order for themselves and share a dish with the rest of the table.

![A group orders at the menu board, with speech bubbles showing what the customers want](https://res.cloudinary.com/sycamore/image/upload/v1794836708/Typora/2026/11/16/dungeon-tavern-ordering.png)

To serve a drink, you pick up an empty cup at the bar, fill it from the barrel and carry it to the customer’s table. Once the customers have finished eating and drinking, you come back to collect the money.

Food preparation is still simplified. There are several dishes to choose from, but for now every serving is represented by a drink.
I plan to add ways to prepare individual dishes and let the player choose what goes on the menu for the day.

![The owner holds an empty cup beside the barrel, with a prompt to press F to fill it](https://res.cloudinary.com/sycamore/image/upload/v1794843224/Typora/2026/11/16/dungeon-tavern-filling-a-mug.png)

Some customers leave as soon as they’ve paid. Others stay a little longer. On the first day, settling the bill with Bran, an old blacksmith, gives you a chance to talk to him.
You can ask about his hammer. Once he’s told you about forging weapons and repairing armor, you can ask him more.
The conversation takes place right at the table. You decide what interests you and whether to follow up. If you keep asking the same question, the customer’s reply changes.

![After Bran pays, the owner can ask about his hammer or end the conversation](https://res.cloudinary.com/sycamore/image/upload/v1794836708/Typora/2026/11/16/dungeon-tavern-bran-conversation.png)

## What’s playable in the demo

As of October 18, 2026, only the first day’s story is playable. You get up in the underground seal room, find Eve upstairs and talk to her, open for business and serve the customers. Pulling the lever to close the tavern brings the demo to an end.

There’s no save system yet, so quitting partway through means starting over.

The owner and Eve have their own character models in the game. Bran and the other customers still share a placeholder model.

The dialogue for days two and three can be previewed as Ink scripts. To make those days playable, I still need to connect those conversations to the rest of the story and the events in the tavern.

---

There’s plenty more to cover in this demo. In the next post, I’ll follow customers from the moment they arrive to the time they pay and leave, including how they choose seats and order together.
