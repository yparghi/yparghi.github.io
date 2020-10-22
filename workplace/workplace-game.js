var gameName = "Workplace Harassment";
var world = new GameWorld();


/***** Rooms *****/

let roomOffice = new GameRoom("office");
roomOffice.desc = `It's the main office floor, with your cubicle.

You've been working here three years. The people are nice, the benefits are nice (except for your new boss), the work is a little dull... But you're not about to leave when 2 months' maternal leave are on the line.

Your desk is plainly adorned -- you never were much for decorating -- with a framed photo of your husband and a collection of your teabags in an old flower pot.`;

let roomBreak = new GameRoom("break room");
roomBreak.desc = `It's your standard office breakroom: a microwave, a coffeemaker, a dirty counter resined with years of spills, and a small table. Someone has "borrowed" all the chairs.`;

let roomSupply = new GameRoom("supply room");
roomSupply.desc = `It's the office's supply room, little more than a closet, with shelves of sticky pads, highlighters, manila envelopes, etc. There's also the office's only printer, whom the team has fondly dubbed "Shitshow".`;

let roomBoss = new GameRoom("boss office");
roomBoss.desc = `Your boss's office is just across the hall from your cubicle. (Great).

It's usually empty -- your boss's leadership style can best be described as roaming and squawking.`;


roomOffice.exits = [new RoomExit(roomBreak), new RoomExit(roomSupply), new RoomExit(roomBoss)];
roomBreak.exits = [new RoomExit(roomOffice)];
roomSupply.exits = [new RoomExit(roomOffice)];
roomBoss.exits = [new RoomExit(roomOffice)];


/***** Characters *****/

let charBoss = new Character("boss", {
    "default": () => { return `"If you could get on that, that'd be great."` },
});
charBoss.isVisible = () => { return false; };
charBoss.desc = `He's been your boss for two insufferable months now. He came on when your old boss (who was great) left for a better position. You wish you could have followed him, but with your pregnancy, it wasn't the right time to switch jobs.`;
charBoss.doInteract = (commandObj) => {
    return `He ignores you. Turns out, he's made it passive-aggressively clear that he prefers you put work items on his desk first.`
};
charBoss.receiveInteract = charBoss.doInteract;


/***** Objects *****/
let medicineObj = new GameObject("medicine");
medicineObj.desc = `It's your morning sickness medication, promethazine. You accidentally left your only bottle at the office last night, whence the puking this morning.

Side effects include dizziness and fainting, and boy howdy do they. More than once in meetings you've stood to leave and tumbled back into your chair, barely missing the floor. It's earned you the nickname of "the fainting girl" around the office -- You're not offended by that necessarily, you just wish it was something more clever, like "The Leaning Tower", or "Lady Daze".`;

let computerObj = new GameObject("computer");
computerObj.desc = "It's your computer. As usual, it's open to your email. Your last communique was with HR, about getting a new chair. Your request has been marked 'Escalated', whatever that means.";

let formObj = new GameObject("form 68a-j");
formObj.desc = `It's Form 68A-J, a standard procurement form for software. Part of your job is reviewing them before sending them up to a director for final approval.

Why your office still prints stuff out on paper is beyond you. Maybe it's because digital forms are scary and magical to the company leadership.`;

let formInv = InventoryItem.fromGameObj(formObj);
formObj.doTake = (commandObj) => {
    world.removeObjFromCurrentRoom(formObj);
    world.addInv(formInv);
    world.state["has_form"] = true;
    return "You sign the Form 68A-J and take it.";
};


roomOffice.objects = [medicineObj, computerObj, formObj];


let bleachObj = new GameObject("bleach");
bleachObj.desc = "Good old-fashioned bleach. It's there for the janitors, or for anyone who needs to hide a mess in the bathroom.";

let printerObj = new GameObject("printer");
printerObj.desc = `The office printer, fondly dubbed "Shitshow", is ready and waiting to fuck up your document. It blinks smugly.`;

let draftObj = new GameObject("printed draft");
draftObj.desc = "It's the printed document your boss asked you to proofread.";
// TOOD: isVisible() on draftObj.

let draftInv = InventoryItem.fromGameObj(draftObj);
draftObj.doTake = (commandObj) => {
    world.removeObjFromCurrentRoom(draftObj);
    world.addInv(draftInv);
    world.state["has_draft"] = true;
    return "You take the draft, grab a nearby red pen, and circle a single typo on it. There -- now he has to redo it, and you can rinse and repeat.";
};

roomSupply.objects = [bleachObj, printerObj, draftObj];


let cleanerObj = new GameObject("cleaner");
cleanerObj.desc = "Standard household ammonia cleaner. It's just the kind of harsh, chemical stuff you and your filthy officemates deserve.";

let coffeemakerObj = new GameObject("coffeemaker");
coffeemakerObj.desc = "The coffeemaker is a standard drip model, 10 years old and bare-bones. Everyone is afraid to move it or replace it, that's how long it's been here.";

let coffeeInv = new InventoryItem("coffee");
coffeeInv.desc = "It's a fresh cup of coffee. You made it for your boss, because that's totally what you pay your student loans for.";

coffeemakerObj.doInteract = (commandObj) => {
    if (getState("made_coffee", false)) {
        return "You made coffee already -- it's in your inventory.";
    } else {
        world.addInv(coffeeInv);
        world.state["made_coffee"] = true;    
        return `You make a cup of coffee and hang on to it.`;
    }
};

let creamerObj = new InventoryItem("creamer");
creamerObj.desc = `It's an ageless jar of fake coffee creamer. You only use it because if you brought in fresh milk, people would steal it.`;

roomBreak.objects = [cleanerObj, coffeemakerObj, creamerObj];


let deskObj = new GameObject("desk");
deskObj.desc = "Your boss's desk is some kind of fake mahogany. There's not much on it -- it's overly large because it serves only to embiggen your boss's status. Whenever he asks someone (you) to bring him something, he'll sweep his hand across the grandeur of his desk and ask you to place it there.";

formInv.doInteract = (commandObj) => {
    if (commandObj.objTwo != deskObj) {
        return DEFAULT_NOTHING_INTERACTION;
    }
    world.removeInv(formInv);
    world.playCutscene(new Cutscene([
        `"Here." You put the form on his desk, and remember just in time to add some false professional cheer.`,
        `"Gorgeous," he says, picking it up, holding it before you and eyeing it.`,
        `"I'm gonna get back to it," you say, and turn to leave. He's still staring.`,
        `"Oh, just one more thing mom, I got a document review for you."`,
        `He sips his coffee while you wait for him to go on.`,
        `"I just printed out, and your office is closer -- could you go pick it up and proof it?"`,
        `"You don't -- have it?"`,
        `"Nah, it's just down the hall, thanks. Little practice for running around the house, right mom?"`,
        `"Ugh," you say, and move on quickly adding, "I've got a lot of email to catch up on -- can it wait till the afternoon?"`,
        `He looks up at you with smug fake graveness. "Well -- you'd be all caught up if you hadn't gotten here late, right?"`,
        `You mutter, "Fine," turn away and sigh.`,
        `He adds on your way out, "And don't sweat it mom, you're filling in from behind."`,        
    ]));
    return null;
};

draftInv.doInteract = (commandObj) => {
    if (commandObj.objTwo != deskObj) {
        return DEFAULT_NOTHING_INTERACTION;
    }
    world.removeInv(draftInv);
    world.playCutscene(new Cutscene([
        `"Thanks, mom. One more thing, could you pour me a cup of coffee real quick? Mine's low and I'll need a fill-up for proofing your proofing."`,
        `"You -- want me to make you coffee?"`,
        `"No bigs if you can't, just a gesture, you know, to make up for coming in late."`,
        `You return to your desk still muttering. This means war. If he wants you to make coffee, then so be it -- he'll have to drink it YOUR way.`,
    ]));
    return null;
};

coffeeInv.doInteract = (commandObj) => {
    if (commandObj.objTwo === deskObj) {
        if (getState("coffee_is_ready", false)) {
            world.endGame(new Cutscene([
                `"Here you go," you say, placing a near-full cup of poisoned coffee on his desk with special, graceful care.`,
                `"Thanks, babe." You watch with straight-faced glee as he lifts it up and grossly puckers his lips to it.`,
                `Finally he sips, smacks his lips loudly, and says "Well, it's a little rich for my taste, but hey -- hormones, right?"`,
                `You nod enthusiastically, and return to your desk energized for a day's work.`,
                `That afternoon there's a staff meeting, and as you all sit around the table, your eyes keep flicking to your boss with a salacious precision that he'd probably enjoy. His lips pucker and blow gently, and he sips. His eyelids close, lashes fluttering together, and he sips. He's sweating -- he's on the fourth or fifth cup of the stuff this afternoon alone.`,
                `The meeting goes over by 10 minutes because there's a disagreement about using "Hi" vs. "Hello" in a marketing email, and hiding in a corner seat you wonder what it's all for -- like, in life.`,
                `Finally the meeting adjourns -- someone suggests we schedule a follow-up meeting to has it out -- and everyone gets up to leave. You plant your hands on the table to begin a slow ascent you've practiced, to ward off vertigo. But your eyes flick aside again, and lock on him.`,
                `And lo and behold, your boss stands up first, with a preening swiftness, squawks and topples to the floor. Everyone rushes to check on him (except you) and he is stammering. "I'm fine, I'm fine." His knees are bent, and they quiver a little on the floor like in a swoon. It's fun to watch.`,
                `When he gets up, he is staring daggers at you. Does he know? You hope so. But what can he say? Who attacks a pregnant lady?`,
                `"Oh no!" you cry. "I guess this office has a new fainting girl!" And everyone laughs as you rise slowly.`,
                `He doesn't ask you to make coffee anymore after that.`,
            ]));
            return null;    
        } else {
            // TODO elaborate on its different states?
            return `Hmm, something's missing from this coffee...`;
        }
    } else {
        return DEFAULT_NOTHING_INTERACTION;
    }
};

roomBoss.objects = [deskObj];


cleanerObj.doInteract = (commandObj) => {
    if (commandObj.objTwo == coffeeInv) {
        return `Yeah, this might give him hell and punch a hole or two in his intestines -- but it lacks a personal touch. He'll never suspect it was you.`;
    } else {
        return DEFAULT_NOTHING_INTERACTION;
    }
};

bleachObj.doInteract = (commandObj) => {
    if (commandObj.objTwo == coffeeInv) {
        return `This may kill him, which is nice, but that's too good for him. It's about sending a message.`;
    } else {
        return DEFAULT_NOTHING_INTERACTION;
    }
};

medicineObj.doInteract = (commandObj) => {
    if (commandObj.objTwo == coffeeInv) {
        world.state["coffee_is_poisoned"] = true;
        return `You pour a generous dollop of promethazine into your boss's coffee. Then a few more, for good measure. On the downside, the mug is now half-full with a sickly stew of obvious not-coffee. You need to top it off somehow.`;
    } else {
        return DEFAULT_NOTHING_INTERACTION;
    }
};

creamerObj.doInteract = (commandObj) => {
    if (commandObj.objTwo == coffeeInv) {
        if (getState("coffee_is_poisoned", false)) {
            world.state["coffee_is_ready"] = true;
            return `There we go, the perfect crime. The coffee now looks innocuously rich with swirls of fake creamer.`
        } else {
            return `Hmmm, there's no point giving him a regular cup of coffee -- that's just what he wants you to do.`;
        }
    } else {
        return DEFAULT_NOTHING_INTERACTION;
    }
};


/***** Hooks *****/

let hookFirstBossVisit = new GameHook();
hookFirstBossVisit.shouldRun = () => {
    return (!(hookFirstBossVisit.hasRun)
        && (world.currentRoom === roomOffice)
        && (world.turnCounter >= 3));
};
hookFirstBossVisit.run = () => {
    firstLineOptions = {
        scrollToTop: false,
        showLeadingHR: true,
        addTopPadding: true,
        showEnteredCommand: false,
    };
    world.state["boss_is_in_office"] = true;
    roomBoss.desc = `Your <span class="objectName">BOSS</span> is at his desk, looking down and pretending to work.`;
    roomBoss.objects.push(charBoss);
    world.playCutscene(new Cutscene([
        `"Whoa-ho, look who decided to come to work today."`,
        `"Fuck," you mask in a sigh.`,
        `Your boss saunters vaguely crotch-first to the edge of your cubicle and drapes his arm over the low wall. He is sipping slowly from his coffee, and eyeing you until you turn your back.`,
        `"Sorry about that, I was -- running around this morning. Baby stuff." After your excuse you turn to him.`,
        `"Ah, baby stuff," he says. "How delightfully vague."`,
        `He smirks and adds, cupping your belly with his eyes, "You're not even showing. Good for you." And he raises his coffee cup to toast you with dull lecherous eyes.`,
        `"Ugh," you answer internally. Then you add, "I'm getting to work right now."`,
        `"Back at ya, mom. I left you a present -- I'll need that form like right now. It was due yesterday, I told them you'd get on it."`,
        `He lingers when you turn your back, and finally heads back into his office and you sigh. The worst thing about being late, you think, is what he does with his smugness.`,
        ]),
        firstLineOptions=firstLineOptions);
};

world.hooks = [hookFirstBossVisit];


/***** Final game setup *****/

if (isTesting()) {
    world.initialRoom = roomOffice;
    world.introCutscene = new Cutscene(["TESTING"]);
    world.state = {
    };

} else {
    world.initialRoom = roomOffice;
    world.state = {};

    world.introCutscene = new Cutscene([
        `You get to the office 20 minutes late, goddammit.`,
        `This morning you almost threw up into your teacup. You're four months pregnant and your morning sickness is getting worse and worse.`,
        `You sidle into your cubicle and glance around. Your boss didn't see you -- thank the lord you're spared his bullshit at least one morning.`,
    ]);
}
