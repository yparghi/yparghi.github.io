// TODOs:
// - For conciseness, consider automatically saying 'Current room: X, Exits: A, B, C' and the desc. only comes from 'look'?
// - Consider declaring state keys and their default values up front?
// - Fix bug on 'go <room object>'

// NEXT: Implement 'use sugar on coffee'.
// NEXT: Remove fullSugarInv, place fullSugarObj.


// TODO: Find a better way than a global var?
var gameName = "Hospital";
var world = new GameWorld();


/***** Rooms *****/
// TODO: 'you need coffee' alert?
roomBed = new GameRoom("hospital bed");
roomBed.desc = "You are in a corner room of the critical care unit, where your wife sleeps.";

roomHallway = new GameRoom("hallway");
roomHallway.desc = `You are in the hallway of the critical care unit, at one end by the fire exit. It's surprisingly busy for a Wednesday night. Nurses are criss-crossing rooms like they were salvoed from one to the other.

The hub of the unit, the nurses' station, is at the end of the hall, in the lobby.
`;
roomHallway.entryHooks.push(() => {
    if (!getState("coffee_quest_completed", false)) {
        return null;
    }

    return `
        A new mumbling fills this hall.
        From an open room you hear a man's voice reading aloud.
        "A child shot at a train station in Chicago," he says.
        You pause, shy of the room's open door.
        "An annual gathering of inner tubers," he goes on.
        "A recipe for asparagus tart."
        Mustering the nerve to pass, you step off toward the other wall and peek inside. There is a still, unconscious woman in the bed.
        "Here's one about your otters," the man says.
        You slip by, coffee in hand, to go unnoticed.
    `;
});

roomNurse = new GameRoom("nurse station");
roomNurse.desc = `The nurses' station, at the lobby of the critical care unit, is a broad hexagonal white desk partly enclosed by glass on two sides.
`;

roomEastWing = new GameRoom("east wing");
roomEastWing.desc = `
    The east wing of the critical care unit is a hallway just like the others, lined with bedrooms on either side. Sounds of heart monitors and ventilators come from each of them as you pass, except for one small room at the end, in which you see a table and a fridge.
`;

roomBreak = new GameRoom("break room");
roomBreak.desc = `
    There's a plain round table, and a small kitchen with a sink, fridge, and cabinets. A coffeemaker is on the counter, next to piles of napkins, sugar packets, and styrofoam cups. There's also a carton of artificial, powdered creamer.

    It's about as depressing in here as one of the bedrooms, but at least there's no beeping and honking.
`;

roomWestWing = new GameRoom("west wing");
roomWestWing.desc = `The west wing of critical care is just like the other two. About half the bedrooms are closed, the others keep beeping. You hear muffled sobbing, filling the hall generally. A small white closet door, shut and labeled, is at the end of the hall.
`;


roomCloset = new GameRoom("closet");
roomCloset.desc = "It's a cramped supply closet. You almost have to turn sideways to fit between the shelves on either side. Most of it is medical equipment -- masks, swabs, plastic-wrapped gowns -- but there are also some niceties like cereal cups and soy sauce.";


/***** Exits *****/
roomBed.exits = [new RoomExit(roomHallway)];

roomHallway.exits = [new RoomExit(roomBed), new RoomExit(roomNurse)];

eastWingExit = new RoomExit(roomEastWing);
eastWingExit.isVisible = () => { return getState('east_wing_revealed', false) };
westWingExit = new RoomExit(roomWestWing);
westWingExit.isVisible = () => { return getState('west_wing_revealed', false) };
roomNurse.exits = [new RoomExit(roomHallway), eastWingExit, westWingExit];

roomEastWing.exits = [new RoomExit(roomNurse), new RoomExit(roomBreak)];

closetExit = new RoomExit(roomCloset);
closetExit.isVisible = () => { return !getState('closet_door_closed', true) };
roomWestWing.exits = [new RoomExit(roomNurse), closetExit];

roomCloset.exits = [new RoomExit(roomWestWing)];


/***** Characters *****/
wifeChar = new Character("wife", {
    "default": () => "She is in a frail sleep.",
    "coffee_quest_completed": () => {
        // TODO: world.endGame(endMessage)?
        world.endGame(`
            You ease back into your chair with a sigh, holding your coffee steady. You take a sip, and gaze out vaguely over her rising belly.

            "Tonight's been a rough night," you say to her. "I've been drinking so much of this stuff I could fly to the moon."

            You hunch forward over your knees, to stretch your back. You add, "I guess we should be thankful for our problems sometimes."

            You look at her, and set your cup down on the floor.

            "I'll pace myself," you tell her. "I want to be here when you get up."
        `);
        return null;
    },
});
wifeChar.desc = "She is asleep, as she has been for 24 hours. Her pulse beeps out steadily, even slowly. You've already neatened her hair twice this hour.";


tanyaChar = new Character("tanya", {
    "default": () => `
        "Excuse me miss, is there coffee nearby?"
        "It's late," she says curtly. "You shouldn't be drinking coffee."
    `,
});
tanyaChar.desc = "She is in her 20s, but she has a fixed scowl like an older person.";


brittaniaChar = new Character("brittania", {
    "default": () => `
        "Hello, do you know where I could find coffee?"
        Her eyebrows go up, but she didn't seem to hear you. She was hitting a high note to herself.
    `,
});
brittaniaChar.desc = "She is humming to herself as she works at the computer.";


marnieChar = new Character("marnie", {
    "default": () => {
        world.state['east_wing_revealed'] = true;

        return `"Excuse me, is there coffee nearby?"
        "Huh?"
        "Uh -- coffee?"
        You hold your hand up in a fist -- it's supposed to look like a mug.
        She pauses, looks off again, and a moment later flicks her head over her shoulder down a side hall.`;
    },
    "tried_empty_sugar_can": () => {
        world.state['west_wing_revealed'] = true;

        // TODO? set a state for a shorter dialogue after this?
        return `
            "Hi there," you say. "Well, I found the coffee, but you guys seem to have run out of sugar."
            Marnie rolls her eyes sideways at you and openly stares. Her weary eyelids flutter.
            "So I was wondering, do you have another can of sugar somewhere? I don't mind going to get it."
            "I don't know, sir," she answers dryly.
            "Brittania," she goes on, "can we order more swabs for the west wing closet?"
            She goes to the computer and leans over Brittania's shoulder, lowering her voice.
            "Oh, there's a west wing?" you ask, chiming.
            Marnie glances over glowering, and resumes their conversation looking very serious.
        `;
    },
});
marnieChar.desc = "She is middle-aged, pale, with broadly painted lips and a tired thinking gaze.";


/***** Objects *****/
roomBed.objects = [wifeChar];

openDoorObj = new GameObject("open door");
openDoorObj.desc = `It's an open door. Inside, a nurse stands over an eerily quiet family.`;

openDoorObj.doInteract = (commandObj) => {
    if (getState("got_yelled_at_by_nurse", false)) {
        return `No... Let's not put you through that again.`;
    }
    world.state["got_yelled_at_by_nurse"] = true;
    return `You peer inside.
    "Uh, excuse me, do you know if there's a coffee machine?"
    You attempt to maintain eye contact only with the nurse, but from curiosity your eyes can't help flick aside, across a weeping family.
    "GET OUT, YOU CRETIN!" says the nurse.
    You get out.`;
};
openDoorObj.doGo = openDoorObj.doInteract;

roomHallway.objects = [openDoorObj];

roomNurse.objects = [tanyaChar, brittaniaChar, marnieChar];


// East wing random event
eastOpenDoorObj = new GameObject("open door");
eastOpenDoorObj.desc = "It's an open bedroom door. Inside, you see a man and a woman, seated close and half-whispering.";
eastOpenDoorObj.doInteract = (commandObj) => {
    if (getState("looked_in_east_door", false)) {
        return `Eh, leave them to their troubles.`;
    }
    world.state["looked_in_east_door"] = true;
    return `You peer in discreetly, from the other side of the hall, just in case there's a staff member in there.
    There isn't. Instead, a middle-aged couple -- brother and sister, you realize, as they talk -- are sitting close beside a sleeping parent and whispering heatedly.
    "Half isn't half in this case," says the man.
    "When is half not half? What are you talking about?"
    "I'm just saying, some assets come with debts."
    You walk on a bit, till you're out of view, so that you don't hear anymore.`;
};
eastOpenDoorObj.doGo = eastOpenDoorObj.doInteract;

roomEastWing.objects = [eastOpenDoorObj];


// Break room & coffee

coffeeCupObj = new GameObject("coffee cup");
coffeeCupObj.desc = "It's a cup of hot crappy coffee.";


coffeeCupInv = InventoryItem.fromGameObj(coffeeCupObj);
coffeeCupInv.doInteract = (commandObj) => {
    if (getState("coffee_has_sugar", false)) {
        return `You pause to lean against a nearby wall and drink your coffee. It is bitter and saccharine in swapping flavors.

        In a few minutes you feel more game for the night, and that feeling lasts for a few minutes. Soon you're tired again, but confident your bouncing thoughts will keep you up a little longer.

        You realize you'd better put the sugar can with the coffee, so others can use it.
        `;
    } else {
        return "Ugh, there's no sugar in this coffee. Years of stress at work and at home have hardened your need for small pleasures, like sugar in your coffee. You simply can't proceed until you find sugar for your coffee.";
    }
};

coffeeCupObj.doTake = (commandObj) => {
    world.removeObjFromCurrentRoom(coffeeCupObj);
    world.addInv(coffeeCupInv);
    world.state["has_coffee"] = true;
    return "You take the coffee cup.";
};

// Declare the full sugar can here so we can define the interaction with the coffeemaker.
let fullSugarObj = new GameObject("full sugar");
let fullSugarInv = InventoryItem.fromGameObj(fullSugarObj);

let coffeeMakerObj = new GameObject("coffeemaker");
coffeeMakerObj.desc = "It's your standard coffeemaker -- flip a switch, and it fills the pot.";

let replaceSugarCanInteraction = () => {
    world.removeObjFromCurrentRoom(sugarCanObj);
    world.addObjToCurrentRoom(fullSugarObj);
    world.removeInv(fullSugarInv);

    world.state["coffee_quest_completed"] = true;

    return `You toss the empty sugar can in the wastebasket nearby. You set the full, fresh can on the counter in its place. Well done, sir.

        Now you can get back and see about your wife.`;
};

coffeeMakerObj.doInteract = (commandObj) => {
    if (commandObj.objTwo == fullSugarInv) {
        return replaceSugarCanInteraction();
    }

    if (getState("coffee_made", false)) {
        return `You've already made a cup of coffee. One is enough for your jangled nerves -- for now.`;
    }
    roomBreak.objects.push(coffeeCupObj);
    world.state["coffee_made"] = true;
    return "There is now a cup of coffee.";
};

sugarCanObj = new GameObject("sugar can");
sugarCanObj.desc = "A can of sugar is on the counter next to the coffee maker.";
sugarCanObj.doInteract = (commandObj) => {
    if (commandObj.objTwo == fullSugarInv) {
        return replaceSugarCanInteraction();
    }
    world.state["tried_empty_sugar_can"] = true;
    return "Bah, it's empty.";
}
sugarCanObj.doTake = sugarCanObj.doInteract;

roomBreak.objects = [coffeeMakerObj, sugarCanObj];
roomBreak.exits = [new RoomExit(roomEastWing)];

closetObj = new GameObject("closet door");
closetObj.desc = "It's a narrow white door. The peeling label on it reads 'Supplies'.";
closetObj.isVisible = () => { return getState('closet_door_closed', true) };
closetObj.doInteract = (commandObj) => {

    if (!getState("seen_old_man", false)) {
        world.state["seen_old_man"] = true;
        world.playCutscene(new Cutscene([
            `"EXCUSE ME"`,
            `You gasp and wheel around. Before you stands an old ghostly white man in a patient's gown, untied, whose sides waft creepily at his hips.`,
            `"Uh, yeah?" you manage to answer.`,
            `"DO YOU HAVE GOWNS?"`,
            `"Uh." You shake your head.`,
            `"MY GOWN IS BROKEN. DO YOU KNOW HOW TO FIX MY GOWN?"`,
            `You shake your head again, timidly.`,
            `"THANK YOU"`,
            `The man walks off down the hall, toward the nurse's station. His gown, like wings, wafts in the hallway air conditioning about his bare gaunt ass.`,
        ]));
        return null;
    }

    world.state['closet_door_closed'] = false;
    return "Hmm. The knob is locked and won't turn. But you notice the door isn't pulled shut all the way, so after casting a furtive glance at the nurses' station, you push in and open the door.";
};

roomWestWing.objects = [closetObj];


fullSugarObj.desc = "It's a fresh, full can of sugar.";
fullSugarInv.doInteract = (commandObj) => {
    if (commandObj.objTwo == null || commandObj.objTwo == coffeeCupInv) {
        world.state["coffee_has_sugar"] = true;
        return "Your coffee now has sugar. Glorious!";
    } else if (commandObj.objTwo == coffeeMakerObj || commandObj.objTwo == sugarCanObj) {
        return replaceSugarCanInteraction();
    } else {
      return null;
    }
};
fullSugarObj.doTake = (commandObj) => {
    world.removeObjFromCurrentRoom(fullSugarObj);
    world.addInv(fullSugarInv);
    world.state["has_sugar"] = true;
    return "You take the full sugar can.";
};

roomCloset.objects = [fullSugarObj];


/***** Alerts *****/

let putAwaySugarAlert = () => {
    if (!getState("coffee_has_sugar", false)) {
        return null;
    }

    return "You should put the new sugar can next to the coffeemaker.";
};
world.alerts.push(putAwaySugarAlert);


/***** Final game setup *****/

let doTest = false;
if (doTest) {
    world.initialRoom = roomBreak;
    world.introCutscene = new Cutscene(["TESTING"]);
    world.state = {
        "east_wing_revealed": true,
        "west_wing_revealed": true,
        "got_yelled_at_by_nurse": true,
        "coffee_quest_completed": true,
    };

} else {
    world.initialRoom = roomBed;
    world.state = {};

    world.introCutscene = new Cutscene([
    "You are seated in a cramped and creaky little wooden chair, in a corner bedroom of the critical care unit of the hospital.",
    "Your wife is still asleep. She has been stable since this afternoon, which is small consolation since the days feel so long. She is intubated, and her pulse beeps out. She's connected to several machines, which are connected to other machines. One of them even gives an odd honk every now and then.",
    "You check the time on the wall clock. It's midnight. You've insisted on staying up, for some reason, but without another cup of coffee you fear you'll nod off and miss something.",
    ]);
}

