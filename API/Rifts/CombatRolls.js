//!attack --[[1d20]] --[[3d6]] --saying! --ammotype
/*global OuterDiv PlaySound TopBar iPart MidBar BottBar MakeRollNum log on findObjs randomInteger RollRight _ sendChat bShadow font getObj
 */
on('chat:message', function(msg) {
	if (msg.type != "api") return;
	//log(msg.content);
	var msgTxt = msg.content;
	var command = msgTxt.split(" ", 1);
	var cWho = findObjs({_type: 'character',name: msg.who})[0];
	if (cWho == undefined && msg.who.indexOf("(GM)") == -1) {
		cWho = RollRight(msg.playerid);
		msg.who = cWho.get("name");
	}

/*-----------CHECK API-----------*/
	if (command == "!attack") {
/*-----------BOXES-----------*/
		var Main;
		var PlayerBGColor = getObj("player", msg.playerid).get("color");
		var PRGB = hexToRgbP(PlayerBGColor);
        var PlayerBarColor = "background-image: -webkit-linear-gradient(left, rgba(0,0,0,0.8),"+PRGB+","+PRGB+",rgba(0,0,0,0.8));";
		var MIDBAR = MakeMid(MidBar,PlayerBGColor,PlayerBarColor);
		var RollColor = "background-image:-webkit-linear-gradient(left, #000000,#820101,#000000);";
		var topimg = "https://s3.amazonaws.com/files.staging.d20.io/images/181118/cN5ui3MXx87UBgVUgzwYTQ/med.jpg?141868063";
		var TextShadow = "-1px -1px #444, 1px -1px #444, -1px 1px #444, 1px 1px #444";
		var SayParts = "<div style='text-shadow: 1px 1px #000, -1px -1px #000, -1px 1px #000, 1px -1px #000; margin: 0em 0em 0em 0em;; font-size:8pt; display:inline-block; text-align: center; vertical-align:middle; padding: 0px 6px 0px 6px; border: 1px solid #000; border-radius: 3px; color: #FFF; background-image: url(" + topimg + ");'>";
		var RollDiv = "<div style='margin: 0em 0.1em 0.1em 0em; font-size: 10pt; text-shadow: " + TextShadow + "; width: 15px; height: 15px; line-height: 15px; display:inline-block; text-align:center; padding: 0px 1px 0px 0px; border: 1px solid #000; border-radius: 3px; color: #FFF;";
		var MainSayDiv = "<div style='width: 95%; margin: 0px auto; box-shadow: " + bShadow + "; text-shadow: 1px 1px #878787; font-family:" + font + "; font-size: x-small; text-align: center; vertical-align: middle; padding: 1px; border-left: 1px solid #000; border-right: 1px solid #000; border-top: 2px solid #000; border-radius: 0px; background-color:#CEC7B6; color: #000;'>";
		var MainEvenDiv = "<div style='width: 95%; margin: 0px auto; box-shadow: " + bShadow + "; text-shadow: 1px 1px #878787; font-family: " + font + "; text-align: center; vertical-align: middle; padding: 1px; border-left: 1px solid #000; border-right: 1px solid #000; border-radius: 0px; background-color: #CEC7B6; color: #000;'>";
		var MainOddDiv = "<div style='width: 95%; margin: 0px auto; box-shadow: " + bShadow + "; text-shadow: 1px 1px #878787; font-family: " + font + "; text-align: center; vertical-align: middle; padding: 1px; border-left: 1px solid #000; border-right: 1px solid #000; border-radius: 0px; background-color: #C0B9A8; color: #000;'>";
		var AmmoDiv =  "<div style='width: 95%; margin: 0px auto; box-shadow: " + bShadow + "; font-family: " + font + "; font-size: 8pt; text-align: center; padding: 1px; border-left: 1px solid #000; border-right: 1px solid #000; border-radius: 0px; color: #000;";
/*---------------------------*/
		var who = msg.who;
		msg.content = MakeRollNum(msg.content, msg.inlinerolls);
//check rolls---------------------
		var AttackRolls = msg.inlinerolls[0];
		var DamageRolls = msg.inlinerolls[1];
//define var----------------------
		if (AttackRolls === undefined || DamageRolls === undefined) {
			sendChat('', "/direct <B><I>bad macro!");
			return;
		}
		msgFormula = msgTxt.split(" --");
		var Lucky = 20;
		var failRange = 1;
		var DamageRollRaw = "";
		var BottomText = "";
		var fumble = 0;
		var miss = 0;
		var crit_img = "http:\\//media.giphy.com/media/3KqZp8MBaf1Ty/giphy.gif";
		var fail_img = "http:\\//fc06.deviantart.net/fs70/f/2013/076/5/2/_tutorial__creating_an_animated_light_pulse_in_ps_by_d_k0d3-d5ybir4.gif";
		if (msg.who == "GM (GM)") {
			who = "NPC";
		}
/*-----------START-----------*/
//Check for GUN
		if (who !== "NPC") {
			if (msgFormula[4] === undefined) msgFormula[4] = msgFormula[3];
			if (msgFormula[4] !== undefined) {
				var gunleng = msgFormula[4].length - 1;
				var ammo = parseInt(msgFormula[4].substr(gunleng), 10);
				if (!isNaN(ammo)) {
					gunleng = msgFormula[4].length - 2;
					var gun = msgFormula[4].substr(0, gunleng);
					var FindGun = findObjs({current: gun,type: "attribute",_characterid: cWho.id}, {caseInsensitive: true})[0];
					if (FindGun == undefined) {
						sendChat('Error', "/desc " + msg.who + " You do not own a  " + gun);
						return;
					}
					var GunName = FindGun.get("name");
					var leng = GunName.length - 5;
					leng = GunName.substr(0, leng);
					var ammo0 = findObjs({name: leng + "_WEAPpay",type: "attribute",_characterid: cWho.id}, {caseInsensitive: true})[0];
					if (ammo0 == undefined) {
						ammo0 = FindGun;
					}
				}
			}
		}
/*-----------ATTACK PARTS-----------*/
//--Attack Modifier
		var AttackBonus;
		var AttackRollText;
		if (AttackRolls.results.rolls[1] === undefined) AttackBonus = "";
		else AttackBonus = (AttackRolls.results.rolls[1].expr);
		var AttackRollRaw = AttackRolls.results.rolls[0].results[0]['v'];
//Attack total and type
		var AttackTotal = (AttackRolls.results.total);
		var Atype = "<a style='color:RED'>" + AttackRolls.expression + "</a>";
//--Set Miss
		if (AttackRollRaw <= 3) {
			AttackRollText = RollDiv + "background-color:#A80000;'>" + AttackRollRaw + "</div>";
			BottomText = BottomText + " " + 'MISS';
			var miss = 1;
		}
		else AttackRollText = RollDiv + "background-color:#696969;'>" + AttackRollRaw + "</div>";
/*-----------DAMAGE PARTS-----------*/
//--Damage modifier
		var DamageBonus;
		if (DamageRolls.results.rolls[1] === undefined) DamageBonus = "";
		else DamageBonus = (DamageRolls.results.rolls[1].expr);
		//--Set damage total
		var DamageTotal = DamageRolls.results.total;
//--Make damage text for all rolls
		var dam = DamageRolls.results.rolls[0];
		var i = 0;
		while (dam.results[i] !== undefined) {
			var dNum = dam.results[i]['v'];
			var num;
			var ddimg = "http://image.blingee.com.s3.amazonaws.com/images19/content/output/000/000/000/061/788808721_1076628.gif?4";
			var bg_max = "background-position:center; background-image: url(" + ddimg + ");";
			if (dNum == 1) num = RollDiv + "background-color:#A80000;'>" + dNum + "</div></b></a>";
			else if (dNum == DamageRolls.results.rolls[0].sides) num = RollDiv + "background-color:#00A120;" + bg_max + "'><b>" + dNum + "</b></div></b></a>";
			else num = RollDiv + "background-color:#696969;'>" + dNum + "</div>";
			DamageRollRaw = DamageRollRaw + "" + (num);
			i++;
		}
		var Dtype = "<a style='color:RED;'>" + DamageRolls.expression + "</a>";
		DamageRollRaw = DamageRollRaw + "<b>" + DamageBonus + "</b>";
		var DTOTALS = Dtype + "<b> Damage:<br></b>" + DamageRollRaw + "<b> = <a style='color:BLUE'>" + DamageTotal + "</b></a>";
		if (miss == 1)  DTOTALS = "";
//--Set Double Damage
		if (AttackRollRaw >= 20) {
		    var CritCheer = '<div style="border: 1px solid #666666; border-radius: 20px; width: 99%; height: 40px; overflow: hidden; position: relative;"><img src="https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif" style="position: absolute; top:-35px; left:0px;"/></div>';
			DamageTotal = "<a style='color:RED'><strong>" + DamageTotal * 2 + "!</strong></a>";
			var DTOTALS = Dtype + "<b> Damage:<br></b>" + DamageRollRaw + "<b> = <a style='color:BLUE'>" + DamageTotal + "</b></a><br>"+CritCheer;
			AttackTotal = "<a style='color:RED'><strong>" + AttackTotal + "!</strong></a>";
			BottomText = BottomText + " " + '<b>DOUBLE DAMAGE!</b><BR><b>(NATURAL 20!)</b><br>';
			RollColor = "background-position:center; background-image: url(" + crit_img + ");";
			PlaySound('Critical', 9000);
		}
//set motto
		if (msgFormula[3] !== undefined) {
			var WarCryleng = msgFormula[3].length - 1;
			var sayingCheck = parseInt(msgFormula[3].substr(WarCryleng), 10);
			if (isNaN(sayingCheck)) {
				WarCry = msgFormula[3].toUpperCase();
			}
			else if (msgFormula[3] !== undefined && msgFormula[4] == undefined) {
				WarCry = msgFormula[3].toUpperCase();
				WarCryleng = msgFormula[3].length - 2;
				var WarCry = msgFormula[3].substr(0, WarCryleng).toUpperCase();
			}
		}
		else {
			WarCry = "ATTACK!";
		}
//CHATBOX PARTS----------------
		Main = MainSayDiv + SayParts + "<b><i><marquee><img src='logo.jpg'></marquee> ●" + WarCry + "●</i></b></div></div>";
		Main = Main + MainOddDiv + Atype + " <b>To Hit: </b>" + AttackRollText + "<b>" + AttackBonus + " = <a style='color:BLUE'>" + AttackTotal + "</b></a></div>";
		Main = Main + MainEvenDiv + DTOTALS + "</div>";
//--Lucky roll
		var IsLucky = randomInteger(Lucky);
		if (IsLucky >= Lucky && AttackRollRaw > 4) {
			Main = Main + MainOddDiv + "<a style = 'color:PURPLE'><b>Lucky Shot!: " + aLoc[Math.floor(Math.random() * aLoc.length)] + "</b></div>";
			RollColor = "background-position:50% 54%; background-image: url(http:\\//i.imgur.com/cFiEs5R.gif);";
			BottomText = BottomText + " " + SayParts + "<b><i>●LUCKY SHOT●</i></b></div></div>";

//Fumble roll
		}
		if (AttackRollRaw <= failRange) {
			Main = Main + MainOddDiv + "<a style = 'color:PURPLE'><strong style='font-size: 130%;'><b>Fumble!: " + aFum[Math.floor(Math.random() * aFum.length)] + "</div>";
			RollColor = "background-position:50% 54%; background-image: url(" + fail_img + ");";
			BottomText = BottomText + " " + 'FUMBLE';
			fumble = 1;
		}
/*-----------
AMMO PARTS
-----------*/
		if (FindGun !== undefined && who !== "NPC" && ammo0 !== undefined) {
			var ammoleng = msgFormula[4].length - 1;
			var ammo = parseInt(msgFormula[4].substr(ammoleng));
			var ammoC = parseInt(ammo);
			if (ammoC === undefined || isNaN(ammoC)) ammoC = 1;
			var cAmmo = parseInt(ammo0.get("current"));
			var mAmmo = parseInt(ammo0.get("max"));
			if (isNaN(cAmmo) || isNaN(mAmmo)) {
				sendChat('Error', "/desc Set ammo for  " + gun);
				return;
			}
			var per = (cAmmo / mAmmo) * 100;
			if (mAmmo == 0) {}
			else if (cAmmo <= 0 || cAmmo < ammoC) {
				cAmmo = "0";
				ammo0.set('current', cAmmo);
				Main = AmmoDiv + "background-color:RED;'><b><i>Not Enough " + gun + " ammo left in clip.</div>";
			}
			else if (cAmmo <= 3 || cAmmo < ammoC) {
				cAmmo = cAmmo - ammoC;
				ammo0.set('current', cAmmo);
				var ammoT = '<div style="border: 2px solid #333; background-color: #0D0D0D; border-radius: 13px; padding: 3px;"><div style="background-color: red; width: ' + per + '%; height: 5px; border-radius: 10px;"></div></div>';
				ammoT = AmmoDiv + "background-color:#B82A2A;'><b><i>" + cAmmo + " " + gun + " ammo left in clip.</b></i>" + ammoT + "</div>";
				Main = Main + ammoT;
			}
			else {
				cAmmo = cAmmo - ammoC;
				ammo0.set('current', cAmmo);
				var ammoT = '<div style="border: 2px solid #333; background-color: #0D0D0D; border-radius: 13px; padding: 1px;"><div style="background-color: orange; width: ' + per + '%; height: 3px; border-radius: 10px; margins: 0px;"></div></div>';
				ammoT = AmmoDiv + "background-color:#A8A191;'><b><i>" + cAmmo + " of " + mAmmo + " " + gun + " ammo left</b></i>" + ammoT + "</div>";
				Main = Main + ammoT;
			}
		}
/*-----------SEND CHAT-----------*/
        var pad = "";
        if(BottomText == "") var pad = "padding: 5px 1px;";
		var MsgBox = TopBar + RollColor +";'></div>"+ MIDBAR +"<b>" + who + "  Attacks</b></div>"+Main+"</div>"+BottBar + pad + RollColor +";'><b>" + BottomText + "</b></div>";
		var SendT = MsgBox;
		if (AttackRollRaw <= 3 && fumble != 1) {
			SendT = "<div style='opacity: 0.6;'><strong style='font-size: 90%;'>" + SendT + "</strong></div>";
		}
		if (AttackRollRaw >= 20) {
			SendT = "<strong style='font-size: 130%;'>" + SendT + "</strong>";
		}
		sendChat(who, '/direct ' + SendT);
		PlaySound('dice', 9000);
		return;
	}
//----------------------------
//RELOAD----------------
//----------------------------
	if (command == "!reload") {
		if (cWho !== undefined) {
			var msgFormula = msgTxt.split(" --");
			var gun = msgFormula[1];
			var FindGun = findObjs({current: gun,type: "attribute",_characterid: cWho.id}, {caseInsensitive: true})[0];
			if (FindGun == undefined) {
				sendChat('', '/desc ' + msg.who + ': <b>ammo not found</b>');
				return;
			}
			Clips = 0;
			var attName = FindGun.get("name");
			var Ammo0 = findObjs({name: attName + "pay",type: "attribute",_characterid: cWho.id}, {caseInsensitive: true})[0];
			var Ammo1 = findObjs({name: attName + "Rounds",type: "attribute",_characterid: cWho.id}, {caseInsensitive: true})[0];
			var Clipsc = findObjs({name: attName + "clip",type: "attribute",_characterid: cWho.id}, {caseInsensitive: true})[0];
			if (Clipsc != undefined) {
				var Clips = parseInt(Clipsc.get("current"), 10);
			}
			var cWep = parseInt(Ammo0.get("current"), 10);
			var mWep = parseInt(Ammo0.get("max"), 10 );
			var cAmmo = parseInt(Ammo1.get("current"), 10);
			if (cAmmo <= 0) {
				var help = OuterDiv + iPart + "background-color:#A80000;'><b>● " + msg.who + ' NO AMMO TO RELOAD!</div>';
				sendChat('', '/direct ' + help);
			}
			else {
				var needed = mWep - cWep;
				if (needed >= cAmmo) {
					needed = cAmmo;
				}
				if (Clips == 10) {
					needed = 1;
					cAmmo = cAmmo - needed;
					var reloads = cAmmo;
					Ammo0.set('current', mWep);
					Ammo1.set('current', cAmmo);
					var help = OuterDiv + iPart + "background-color:#A80000;'><b>● " + msg.who + ' is reloading: ' + needed + " clips on:<br>● " + msgFormula[1] + ' ●<br>' + cAmmo + ' left(' + reloads + 'Clips)</div>';
					sendChat('', '/direct ' + help);
				}
				else {
					cAmmo = cAmmo - needed;
					var reloads = Math.round((cAmmo / mWep) * 10) / 10;
					Ammo0.set('current', cWep + needed);
					Ammo1.set('current', cAmmo);
					var help = OuterDiv + iPart + "background-color:#A80000;'><b>" + msg.who + ' is reloading ' + needed + " Ammo on:<br>● " + msgFormula[1] + ' ●<br>' + cAmmo + ' left(' + reloads + ' reloads)</div>';
					sendChat('', '/direct ' + help);
				}
			}
		}
	}
});
//---AUTO LOCATION ROLLS
var aLoc = ["Head", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "..Dangly Bits! (Main Body)", "FREE ATTACK!"];
//---FUMBLE ROLLS
var aFum = [
	"Hit a totally different friendly target in general direction of aimed target (if possible)",
	"Ungracefully fumbled the attack!, lose next attack",
	"Got something in eye, lose this attack",
	"Missed so badly, it makes the enemy see you and an easy target!",
	"Total gun jam/broke weapon(or limb!).. useless this fight. Must get fixed.",
	"Tripped!, next attack to get up",
	"Miss and weapon jam! (GUN) jams, (MELEE) Missed and stuck in Wall/Floor/Tree/Off Balance/etc loose next attack",
	"Missed, and draws sole aggression of the target",
	"Somehow hit a Flying Squirrel!",
	"Failed so badly nearest ally falls back to help."
];
