

const assets = {};

assets.masterAssets = {}; // folder
assets.masterAssets.love = {}; //folder within folder
import IMPORT_1 from "path/to/masterAssets/love/heart.png"; //asset within folder
assets.masterAssets.love = IMPORT_1;

assets.masterAssets.royal = {}; 
import IMPORT_2 from "path/to/masterAssets/royal/crown.png";
assets.masterAssets.royal.crown = IMPORT_2;
import IMPORT_2 from "path/to/masterAssets/royal/gem.png";
assets.masterAssets.royal.gem = IMPORT_3;

