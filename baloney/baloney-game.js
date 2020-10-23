var gameName = "Baloney";
var world = new GameWorld();


/***** Rooms *****/
let roomDitch = new GameRoom("ditchRoom");
roomDitch.desc = `You're pacing the edge of a drainage ditch that borders the local park. It's surprisingly deep, and its walls are layered with large stones, wet and slippery from a morning rain.

Your dog Baloney is in the ditch, sopping his feet in the mud and prowling for squirrels.`;


/***** Exits *****/


/***** Characters *****/

let charBaloney = new Character("baloney", {
    "default": () => { return `"Whoorf!" says Baloney.` },
});
charBaloney.desc = `Baloney is your 10-year-old beagle, and you've had him since he was a puppy. He's relatively squat because you overfeed him, but he tries to stretch out on his toes often to look taller.

His tail is wagging.`;
roomDitch.objects.push(charBaloney);


/***** Objects *****/

let ditchObj = new GameObject("ditch");
ditchObj.desc = `It's a very deep drainage ditch that borders the local park. It's walled with layers of very slippery rocks. You can't climb down there, meaning you're stuck up here on the edge of it.

Your dog is inside it.`;
ditchObj.doGo = (commandObj) => {
    return `Eh, it's too dangerous to go down there yourself. You might slip or fall from the wet rocks, and then you'd be stuck down there, injured and muddy while Baloney licks your face instead of getting help.`;
};
roomDitch.objects.push(ditchObj);


let purseObj = new GameObject("purse");
purseObj.desc = `It's your purse. It contains <span class="objectName">LIPSTICK</span>, <span class="objectName">LICORICE</span>, <span class="objectName">PEANUTS</span>, some <span class="objectName">CASH</span>, a <span class="objectName">NOTEBOOK</span>, <span class="objectName">PEPPERMINT OIL</span>, some <span class="objectName">RECEIPTS</span>, and a <span class="objectName">NOVEL</span>.`;
roomDitch.objects.push(purseObj);


let licoriceObj = new GameObject("licorice");
licoriceObj.isVisible = () => { return false };
licoriceObj.desc = `It's the black kind. You happen to like this kind.`;
licoriceObj.doInteract = (commandObj) => {
    if (commandObj.objTwo === null) {
        return `You bite off a bit of licorice from the end, and feel briefly better. You wonder how your teeth look.`;
    } else if (commandObj.objTwo === charBaloney) {
        return `You toss a bit into the ditch, where Baloney sniffs it, hops back, digs a hole and buries it.`;
    } else if (commandObj.objTwo === squirrelsObj) {
        return `You toss a bit toward the squirrels, but they are unimpressed. Maybe they prefer the red kind.`;
    } else {
        return DEFAULT_NOTHING_INTERACTION;
    }
}
roomDitch.objects.push(licoriceObj);

let cashObj = new GameObject("cash");
cashObj.isVisible = () => { return false };
cashObj.desc = `You have a paltry 4 dollars, but many, many pennies.`;
cashObj.doInteract = (commandObj) => {
    return `Sadly this situation is not responding to bribes.`;
}
roomDitch.objects.push(cashObj);

let notebookObj = new GameObject("notebook");
notebookObj.isVisible = () => { return false };
notebookObj.desc = `It's a little mini flip notebook where you jot down your ideas.`;
notebookObj.doInteract = (commandObj) => {
    if (commandObj.objTwo === null) {
        return `You flip through and scoff at a few of your written thoughts. Seriously, what's an "idea massage"?`;
    } else if (commandObj.objTwo === charBaloney) {
        return `You read out a little poem you wrote. Baloney wags his tail. He's such a good audience.`;
    } else {
        return DEFAULT_NOTHING_INTERACTION;
    }
}
roomDitch.objects.push(notebookObj);

let receiptsObj = new GameObject("receipts");
receiptsObj.isVisible = () => { return false };
receiptsObj.desc = `It's some old grocery receipts. Snacks, wine, to-go sandwiches, four brands of lip balm, and an eight-dollar dog baklava.`;
receiptsObj.doInteract = (commandObj) => {
    return `You shake your receipts around and wonder why you're not saving any money.`;
}
roomDitch.objects.push(receiptsObj);

let novelObj = new GameObject("novel");
novelObj.isVisible = () => { return false };
novelObj.desc = `It's your latest time-killer at work. It's a thriller about a woman who is being blackmailed by someone in her community, someone close to her, only to find out it was an AI all along. (You skipped to the end shortly after starting it.)`;
novelObj.doInteract = (commandObj) => {
    return `You turn to a random page. It reads: "It wasn't the anger, or the malice in the voice on the other end of phone that gave her chills. It was its coldness."`;
}
roomDitch.objects.push(novelObj);


let lipstickObj = new GameObject("lipstick");
lipstickObj.desc = `It's your workhorse lipstick, a shade you refer to as "adequate dusk".`;
lipstickObj.isVisible = () => { return false };
lipstickObj.doInteract = (commandObj) => {
    return `You freshen your lipstick now that you have some alone time, because Baloney always licks it off.`;
}
roomDitch.objects.push(lipstickObj);

let peppermintObj = new GameObject("peppermint oil");
peppermintObj.desc = `It's a tube of peppermint oil. It's advertised as life-giving and celebratory, but you just use it because you like the smell. And because it's powerful (and you're cheap), it's lasted you a long time.`;
peppermintObj.isVisible = () => { return false };
peppermintObj.doInteract = (commandObj) => {
    if (commandObj.objTwo === null) {
        return `You spread a little bit on your arms. Though you're not convinced it serves any real purpose, at least it -- eh, actually it serves no purpose.

        Oddly though, while Baloney recognizes your refreshed scent and wags his tail, you feel like you're getting a few distrustful looks from the squirrels behind you. Maybe they don't like the scent? Is that a thing? You wish you had Google right now, but your phone battery is dead.`;

    } else if (commandObj.objTwo === ditchObj) {
        if (getState("set_down_peppermint", false)) {
            return `You've already lined the edge of the ditch with peppermint oil. The squirrels are still eyeing it, noses turned up, looking wary.`;
        } else {
            world.state["set_down_peppermint"] = true;
            return `You spread a thick line of peppermint oil along the edge of the ditch, nearly emptying the tub.

            In the trees, and in the grass around you, the squirrels are eyeing your actions with distrust. They near the now fragrant ditch wall cautiously, then retreat.`;
        }

    } else if (commandObj.objTwo === charBaloney) {
        return `You can't get down into the ditch where Baloney is. But if you could, he would lick up the peppermint oil, puke, and beg for more.`;

    } else if (commandObj.objTwo === squirrelsObj) {
        return `You wave your tube of peppermint oil in the general direction of the trees, yelling and gesticulating.

        A few squirrels look down at you, a tinge of fear in their eyes.`;

    } else {
        return DEFAULT_NOTHING_INTERACTION;
    }
};
roomDitch.objects.push(peppermintObj);


let peanutsObj = new GameObject("peanuts");
peanutsObj.desc = `You have an economy size pack of peanuts in your purse. It's your go-to snack because it's cheap and you constantly feel tired at work.`;
peanutsObj.isVisible = () => { return false };
peanutsObj.doInteract = (commandObj) => {
    if (commandObj.objTwo === null) {
        return `You munch on a few peanuts. Worrying about your dog takes up a lot of energy.`;

    } else if (commandObj.objTwo === ditchObj || commandObj.objTwo === charBaloney) {
        if (getState("set_down_peppermint", false)) {
            world.endGame(new Cutscene([
                `Lured in by a snack, the squirrels swarm toward the ditch -- until they stop, clearly distraught. It appears your peppermint barrier has them transfixed at the edge of the ditch, lured in by a siren's song against the rocks. They stand upright at the edge of the ditch, looking down with fixed desire.`,
                `Meanwhile, Baloney can't resist the wall of squirrels tempting him. Goading him. Mocking him! He charges up the side of the ditch with a vengeance to scatter them. They retreat into the trees -- Baloney forgets what he was doing and begins to sniff the line of peppermint oil curiously.`,
                `Relieved, you take him up in your arms and he begins to sniff your face. You squeeze and cuddle him and carry him away from the ditch immediately, his leash dragging as he pants lovingly.`,
                `"You goddamn idiot," you tell him.`,
            ]));
            return null;
        } else {
            return `You toss some peanuts into the ditch. The squirrels go after them immediately, swarming around Baloney and dodging the thrusts of his jaws. Baloney is going crazy with the barking and tromping a few steps in every direction, not sure which way to go. He obviously wants to chase after them -- but unfortunately they're not leading him out of the ditch. So he just flails down there.

            In moments the squirrels have snatched up all your peanuts and scattered, retreating back to the trees around the ditch. They're quickly gone, so Baloney gives up the chase and goes back to pacing the ditch.`;
        }

    } else if (commandObj.objTwo === squirrelsObj) {
        return `You toss a few peanuts toward the trees. Like clumsy ninjas, the squirrels scurry down, snatch them up, devour them, and run back up.`;

    } else {
        return `It's not hungry, apparently.`;
    }
};
roomDitch.objects.push(peanutsObj);


let squirrelsObj = new GameObject("squirrels");
squirrelsObj.desc = `They are ravenous, obstreperous, garden-variety grey squirrels. They're kind of cute when they're not sending your dog into a frenzy, or staring at you begging for food.

The squirrels are hanging out in the trees by your side of the ditch, looking down into it a little warily. They look ready to pounce, but at what?`;
roomDitch.objects.push(squirrelsObj);



/***** Alerts *****/


/***** Final game setup *****/

if (isTesting()) {
    world.initialRoom = roomDitch;
    world.introCutscene = new Cutscene([`<p style="text-align:center;">TESTING</p>`]);
    world.state = {
    };

} else {
    world.initialRoom = roomDitch;
    world.state = {};

    world.introCutscene = new Cutscene([
        `It's a mild autumn day, and you were walking your dog Baloney. Then Baloney saw a squirrel.`,
        `Now Baloney is trapped at the bottom of a muddy, several-feet-deep drainage ditch, pacing and looking for that squirrel -- or any squirrel, really, he doesn't discriminate.`,
        `The ditch is too far down, and a bit too treacherous, for you to climb down there. Besides, you don't want to get dirty. But how will you lure out your adorable idiot?`,
    ]);
}

