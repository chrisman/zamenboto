PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE info (name TEXT PRIMARY KEY, val TEXT DEFAULT NULL);
CREATE TABLE jokes (id INTEGER PRIMARY KEY, joke TEXT, used INTEGER DEFAULT 0);
INSERT INTO "jokes" VALUES(1,'MacGyver povas konstrui aviadilon el maĉgumo kaj paperklipoj. L.L. Zamenhof povas mortigi lin kaj prenas ĝin.',0);
INSERT INTO "jokes" VALUES(2,'L.L. Zamenhof ne legas librojn. Li fiksrigardas ilin ĝis li akiras la informon li deziras.',0);
INSERT INTO "jokes" VALUES(3,'Se vi demandas al L.L. Zamenhof kioma horo estas, li ĉiam respondas "Du sekundoj ĝis". Post vi demandas "Du sekundoj ĝis kion?", li karate piedbatas vin en la vizaĝon.',0);
INSERT INTO "jokes" VALUES(4,'Ekde 1859, la jaro L.L. Zamenhof naskiĝis, mortoj el karatej piedbatoj pliigis dektri-mil procentoj.',0);
CREATE INDEX jokes_used_idx ON jokes (used);
COMMIT;