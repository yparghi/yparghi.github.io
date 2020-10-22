var gameName = "Cheater";
var world = new GameWorld();


/***** Rooms *****/
let roomBed = new GameRoom("bedroom");
roomBed.desc = "This is your boyfriend's bedroom. You've been coming over for a few weeks now. He keeps it spare as guys do -- all Ikea stuff, and all the same fake wood. At least there are different shades of it.";


/***** Exits *****/


/***** Characters *****/


/***** Objects *****/

function checkPassword(currentLocation) {
    if (getState("nightstand_searched", false)
        && getState("dresser_searched", false)
        && getState("closet_searched", false)
        && (getState("password_location", null) == null)) {
        world.state["password_location"] = currentLocation;
    }
}


let nightstandObj = new GameObject("nightstand");
nightstandObj.desc = "His nightstand is deep cherry-colored fake wood. It has two drawers, and you've never seen him use it.";
nightstandObj.doInteract = (commandObj) => {
    world.state["nightstand_searched"] = true;
    checkPassword("nightstand");

    let lines = [
        `The top drawer is empty, save for a little dust.`,
        `The bottom drawer isn't. It has some knickknacks, a few spare bike parts, and a wall of specialty socks.`,
        `You think you hear noise in the hall -- you freeze and turn your head. Nah, just the pipes.`,
        `So sticking your arms in before you have a chance to feel guilty, you pull the socks aside and start rummaging around in the back.`,
        `There are some slips of paper inside -- you pull one out at random. It's an old business card for the college career counselor, and there's a message on the back in his own handwriting: "You are OK."`,
        `Searching further you find a pipe and a half-full bag of pot. Briefly, you wonder why he never offered you any, and you feel a little hurt.`,
        `Finally you find more business cards. "You can be loved," says one. It's dingy at the edges -- it's been gripped. "All things are fleeting," says another.`,
        `You push everything towards the back, rearrange the socks, and close the drawer.`
    ];

    if (getState("password_location", null) == "nightstand") {
        lines.splice(lines.length - 1, 0, `One of them, in all capital letters and underlined, just says "ZEN".`);
    }

    // TODO: some short stub response if you search it again
    world.playCutscene(new Cutscene(lines));
    return null;
};


let dresserObj = new GameObject("dresser");
dresserObj.desc = "His dresser is smoky, almost slate-colored fake wood.";
dresserObj.doInteract = (commandObj) => {
    world.state["dresser_searched"] = true;
    checkPassword("dresser");

    let lines = [
        `It has five drawers, and rummaging through them, it looks like they go by the seasons. One has sandals and board shorts. The next has sweaters, and a pumpkin beanie.`,
        `The bottom drawer has some novelty boxers you've never seen him wear, and -- oh! A bunch of stuffed animals...`,
        `You turn them over in your hands, two or three at a time. There's an elephant that squeaks when you squeeze the trunk. There's a beanbag squirrel with a tear in the side -- poor guy's getting skinnier.`,
        `Oddly enough, some are old and fraying, and some look brand new, tags and all. Were they gifts?`,
        `Feeling you've lingered, you close the drawer.`,
    ];
    if (getState("password_location", null) == "dresser") {
        lines.splice(lines.length - 1, 0, `Oh, and the elephant has an old tag sticking out with the word "Zen" written in marker. Did this elephant belong to someone named Zen?`);
    }

    // TODO: some short stub response if you search it again
    world.playCutscene(new Cutscene(lines));
    return null;
};


let lightSwitchObj = new GameObject("light switch");
lightSwitchObj.desc = `It's somewhere in the closet, if you fumbled around for it.`;
lightSwitchObj.isVisible = () => { return false; };
lightSwitchObj.doInteract = (commandObj) => {
    world.state["closet_light_on"] = true;
    return `You reach in to the closet and snake your arm along the wall, feeling for a switch. You find it, and flip it, and the closet light comes on.`;
};

let closetObj = new GameObject("closet");
let closetInteraction = (commandObj) => {
    if (!getState("closet_light_on", false)) {
        return `It's dark in there. You do remember seeing him fumble with a <span class="objectName">LIGHT SWITCH</span> in there somewhere.`

    } else if (getState("diary_revealed", false)) {
        return `Same old hangers, same old ties, same old intimates. This time you decide to search along the high shelf. You stand on your tippy-toes, run your straining fingers along it, gathering dust, and find his <span class="objectName">DIARY</span>.`;

    } else {
        world.state["closet_searched"] = true;
        checkPassword("closet");

        // TODO shortened version for a 2nd look?
        let lines = [
            `You peek inside his small closet door. (It was, uh, already almost open.)`,
            `There are a lot of empty hangers, a few ties draped on the high shelf, and a couple old jackets on the floor.`,
            `And in the far corner of the floor, there's a pile of underwears -- <i>ladies'</i> underwears. There are bras and panties, and also a few bottles of cream, and a toothbrush, and a phone charging cable...`,
            `The odd thing about it is, it's all neatly tucked in the corner and squared off, the garments folded and the bottles arranged to one side. The charging cable is neatly coiled and seated on top.`,
            `Odd, you think. Most odd. Why does he have all this stuff? Isn't the proper treatment of old intimates to get drunk and light them on fire?`,
        ];
        if (getState("password_location", null) == "closet") {
            lines.push(`Oh, and one of the creams, "Zen Caress Moisturizer", has the word 'Zen' circled crudely with a marker.`)
        }

        world.playCutscene(new Cutscene(lines));
        return null;
    }
};
closetObj.getDisplayText = () => { return closetInteraction(null); };
closetObj.doInteract = closetInteraction;


let phoneObj = new GameObject("phone");
phoneObj.getDisplayText = () => {
    if (getState("phone_unlocked", false)) {
        return  `It's open and it shows a main menu (you can type a section's number into the phone):
        1) PHOTOS
        2) MESSAGES
        3) NOTES`;
    } else {
        return "Unfathomably, he has one of those old flip-style phones, where you navigate by little arrow keys and swearing at it. It's resting unguarded on his nightstand. It's also password-protected.";
    }
}
phoneObj.doInteract = (commandObj) => {
    if (getState("phone_unlocked", false)) {
        return phoneObj.getDisplayText();
    } else {
        return `Dang, it's password-protected. You have to type in a password.`;
    }
};
phoneObj.doSay = (commandObj) => {
    if (!getState("phone_unlocked", false)) {
        if (commandObj.saidWord == "zen") {
            world.state["phone_unlocked"] = true;
            return "Yes! That opens up the main menu on the phone.";
        } else {
            return "Drat, that's not the password.";
        }    
    } else {
        if (commandObj.saidWord == "1" || commandObj.saidWord == "photos") {
            return `There are some photos of his family, and their dog, and... ugh, then a bunch of nudes. You decide you should close the phone, but you don't. You keep scrolling. None of them are obscene, but they're all naked. One reveals the puffy end of a Santa hat in the shot.

            Christ, why would he even keep these??`;

        } else if (commandObj.saidWord == "2" || commandObj.saidWord == "messages") {

            return `You scroll and read a few at random.
            
            "My butt itches"
            
            "You missed a spot I miss you"
            
            "I love how peaceful you look after we make love"
            
            Gross.`;

        } else if (commandObj.saidWord == "3" || commandObj.saidWord == "notes") {

            world.state["diary_revealed"] = true;

            return `There's a grocery list, a couple unlabelled phone numbers, and a reminder about moving his diary out of the closet.
            
            Wait, diary?`;

        } else {
            return "That's not an option on the phone.";
        }
    }
};


let diaryObj = new GameObject("diary");
diaryObj.desc = "It's a thick fancy leather-bound notebook, well used. There's nothing on the cover, just ruffled pages going two-thirds of the way through.";
diaryObj.isVisible = () => { return false; };
diaryInteraction = (commandObj) => {
    if (!getState("shown_diary_prompt", false)) {
        world.state["shown_diary_prompt"] = true;
        return `Are you <i>sure</i> you want to read his diary? There's no going back after this.
        You can either <span class="objectName">TAKE</span> the diary or <span class="objectName">LEAVE</span> it.`;
    }

    world.endGame(new Cutscene([`You begin paging through. Old dreams, waking and sleeping. Kerfuffles. Swells and lulls.`,
        `You get so engrossed that you don't hear the shower cut off and the bedroom door open.`,
        `"Uh..." he says.`,
        `You look up aghast.`,
        `"This is -- not okay," he says quietly.`
    ]));
    return null;
};
diaryObj.doTake = diaryInteraction;
diaryObj.doInteract = diaryInteraction;
diaryObj.doLeave = (commandObj) => {
    world.endGame(new Cutscene([
        `You slip the diary back up on to the shelf, turn off the closet light, and close the door.`,
        `You sit in despondent quiet at the end of his bed, and your legs are swinging slightly as you think. Did you do the right thing?`,
        `He comes back a moment later, bursting through the door and singing, with a halo of shower steam, and stops.`,
        `"What's wrong?" he asks.`,
        `You look up at him with cautious eyes. He's heaving slightly, from his chest, and in his towel looks so frankly tender.`,
        `"It's nothing," you lie. "You look good," you say.`,
        `"Thanks!"`,
        `He sits down next to you, humidity and all, and gently touches your leg. You feel his hand, pressing hard. It's soft and dewy, and calloused at a side of his finger, probably from guitar. You are oddly, guiltily attracted right now.`,
    ]));
    return null;
};

roomBed.objects = [nightstandObj, dresserObj, lightSwitchObj, closetObj, phoneObj, diaryObj];


/***** Alerts *****/


/***** Final game setup *****/

if (isTesting()) {
    world.initialRoom = roomBed;
    world.introCutscene = new Cutscene(["TESTING"]);
    world.state = {
        "dresser_searched": true,
        "closet_searched": true,
        "nightstand_searched": true,
        "closet_light_on": true,
        "diary_revealed": true,
    };

} else {
    world.initialRoom = roomBed;
    world.state = {};

    world.introCutscene = new Cutscene([
        `You have 15 minutes.`,
        `You suspect your boyfriend has been cheating on you. He's been distant lately -- not at all times, but at lulls in your conversations. He peeks constantly, furtively, at his phone. It's something you've only noticed in the last few weeks.`,
        `Right now he's in the shower, and you know he takes long reflective showers without you. You've seen his silhouette through the curtain.`,
        `So you have a little time, but not a lot, to search his room.`,
        `What is he up to?`,
    ]);
}
