Elm.Main = Elm.Main || {};
Elm.Main.make = function (_elm) {
   "use strict";
   _elm.Main = _elm.Main || {};
   if (_elm.Main.values)
   return _elm.Main.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Main",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Graphics$Collage = Elm.Graphics.Collage.make(_elm),
   $Graphics$Element = Elm.Graphics.Element.make(_elm),
   $Keyboard = Elm.Keyboard.make(_elm),
   $List = Elm.List.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Text = Elm.Text.make(_elm),
   $Time = Elm.Time.make(_elm),
   $Window = Elm.Window.make(_elm);
   var toDot = function (b) {
      return A2($Graphics$Collage.move,
      {ctor: "_Tuple2"
      ,_0: b.x
      ,_1: b.y},
      A2($Graphics$Collage.filled,
      $Color.white,
      $Graphics$Collage.circle(b.sz)));
   };
   var mapToDot = function (bs) {
      return A2($List.map,
      toDot,
      bs);
   };
   var bulletForms = function (g) {
      return mapToDot(g.bullets);
   };
   var showAsteroid = F2(function (pos,
   diam) {
      return A2($Graphics$Collage.move,
      pos,
      A2($Graphics$Collage.filled,
      $Color.white,
      A2($Graphics$Collage.ngon,
      5,
      diam)));
   });
   var showAsteroid$ = function (a) {
      return A2(showAsteroid,
      {ctor: "_Tuple2"
      ,_0: a.x
      ,_1: a.y},
      a.sz);
   };
   var mapNgon = function (asteroids) {
      return A2($List.map,
      showAsteroid$,
      asteroids);
   };
   var asteroidForms = function (g) {
      return mapNgon(g.asteroids);
   };
   var make$ = F2(function (obj,
   shape) {
      return $Graphics$Collage.move({ctor: "_Tuple2"
                                    ,_0: obj.x
                                    ,_1: obj.y})($Graphics$Collage.filled($Color.white)(shape));
   });
   var make = F2(function (obj,
   shape) {
      return A2($Graphics$Collage.move,
      {ctor: "_Tuple2"
      ,_0: obj.x
      ,_1: obj.y},
      A2($Graphics$Collage.filled,
      $Color.white,
      shape));
   });
   var bgColor = A3($Color.rgb,
   120,
   120,
   120);
   var showPlane = F2(function (pos,
   orientation) {
      return A2($Graphics$Collage.move,
      pos,
      A2($Graphics$Collage.rotate,
      orientation,
      A2($Graphics$Collage.filled,
      $Color.white,
      $Graphics$Collage.polygon(_L.fromArray([{ctor: "_Tuple2"
                                              ,_0: 10
                                              ,_1: 0}
                                             ,{ctor: "_Tuple2",_0: -8,_1: -5}
                                             ,{ctor: "_Tuple2",_0: -4,_1: 0}
                                             ,{ctor: "_Tuple2"
                                              ,_0: -8
                                              ,_1: 5}])))));
   });
   var gameStateTxt = function (g) {
      return $Text.asText(g.state);
   };
   var noCollide = F2(function (f1,
   f2) {
      return _U.cmp($Basics.sqrt(Math.pow(f1.x - f2.x,
      2) + Math.pow(f1.y - f2.y,2)),
      f1.sz + f2.sz) > 0;
   });
   var noAstCollide = F2(function (g,
   f) {
      return A2($List.all,
      noCollide(f),
      g.asteroids);
   });
   var filterBullets = function (g) {
      return A2($List.filter,
      noAstCollide(g),
      g.bullets);
   };
   var noBulletCollide = F2(function (g,
   a) {
      return A2($List.all,
      noCollide(a),
      g.bullets);
   });
   var filterAsteroids = function (g) {
      return A2($List.filter,
      noBulletCollide(g),
      g.asteroids);
   };
   var getNewPos = F3(function (_v0,
   ori,
   acc) {
      return function () {
         switch (_v0.ctor)
         {case "_Tuple2":
            return {ctor: "_Tuple2"
                   ,_0: _v0._0 + $Basics.cos(ori) * $Basics.toFloat(acc) * 0.2
                   ,_1: _v0._1 + $Basics.sin(ori) * $Basics.toFloat(acc) * 0.2};}
         _E.Case($moduleName,
         "on line 81, column 29 to 91");
      }();
   });
   var getNewFlying = function (f) {
      return function () {
         var $ = A3(getNewPos,
         {ctor: "_Tuple2"
         ,_0: f.x
         ,_1: f.y},
         f.ori,
         f.acc),
         x = $._0,
         y = $._1;
         return _U.replace([["x",x]
                           ,["y",y]],
         f);
      }();
   };
   var advanceTime = function (g) {
      return {_: {}
             ,asteroids: A2($List.map,
             getNewFlying,
             g.asteroids)
             ,bullets: A2($List.map,
             getNewFlying,
             g.bullets)
             ,plane: getNewFlying(g.plane)
             ,state: g.state
             ,time: g.time + 1};
   };
   var getNext = function (f) {
      return function () {
         var $ = A3(getNewPos,
         {ctor: "_Tuple2"
         ,_0: f.x
         ,_1: f.y},
         f.ori,
         1),
         x = $._0,
         y = $._1;
         return _U.replace([["x",x]
                           ,["y",y]],
         f);
      }();
   };
   var doNtimes = F3(function (k,
   f,
   a) {
      return _U.cmp(k,
      0) < 1 ? a : A3(doNtimes,
      k - 1,
      f,
      f(a));
   });
   var changeGames = F2(function (space,
   g) {
      return space ? function () {
         var bullets2 = A2($List._op["::"],
         A3(doNtimes,
         4 * $Basics.round(g.plane.sz),
         getNext,
         {_: {}
         ,acc: g.plane.acc + 4
         ,ori: g.plane.ori
         ,sz: 1
         ,x: g.plane.x
         ,y: g.plane.y}),
         g.bullets);
         return _U.insert("bullets",
         bullets2,
         _U.remove("bullets",g));
      }() : g;
   });
   var changeGamey = F2(function (y1,
   g0) {
      return function () {
         var plane0 = g0.plane;
         var plane2 = _U.insert("ori",
         plane0.ori + $Basics.toFloat(y1) * -0.1,
         _U.remove("ori",plane0));
         return _U.insert("plane",
         plane2,
         _U.remove("plane",g0));
      }();
   });
   var changeGamex = F2(function (x,
   g0) {
      return function () {
         var plane0 = g0.plane;
         var plane2 = _U.insert("acc",
         plane0.acc + x,
         _U.remove("acc",plane0));
         return _U.insert("plane",
         plane2,
         _U.remove("plane",g0));
      }();
   });
   var getAsteroids = function (g) {
      return g.asteroids;
   };
   var heartbeat = $Time.every($Time.second / 20);
   var Game = F5(function (a,
   b,
   c,
   d,
   e) {
      return {_: {}
             ,asteroids: d
             ,bullets: c
             ,plane: b
             ,state: a
             ,time: e};
   });
   var Flying = F5(function (a,
   b,
   c,
   d,
   e) {
      return {_: {}
             ,acc: d
             ,ori: c
             ,sz: e
             ,x: a
             ,y: b};
   });
   var Lost = {ctor: "Lost"};
   var Won = {ctor: "Won"};
   var collisionAction = function (g) {
      return function () {
         var g2 = _U.replace([["bullets"
                              ,filterBullets(g)]
                             ,["asteroids"
                              ,filterAsteroids(g)]],
         g);
         return $Basics.not(A2(noAstCollide,
         g2,
         g.plane)) ? _U.replace([["state"
                                 ,Lost]],
         g2) : _U.eq(g2.asteroids,
         _L.fromArray([])) ? _U.replace([["state"
                                         ,Won]],
         g2) : g2;
      }();
   };
   var Playing = {ctor: "Playing"};
   var defaultGame = {_: {}
                     ,asteroids: _L.fromArray([{_: {}
                                               ,acc: 2
                                               ,ori: 1
                                               ,sz: 15
                                               ,x: 100
                                               ,y: 100}
                                              ,{_: {}
                                               ,acc: 4
                                               ,ori: 2
                                               ,sz: 10
                                               ,x: 150
                                               ,y: -150}
                                              ,{_: {}
                                               ,acc: 6
                                               ,ori: 3
                                               ,sz: 20
                                               ,x: -150
                                               ,y: 150}
                                              ,{_: {}
                                               ,acc: 8
                                               ,ori: 4
                                               ,sz: 30
                                               ,x: -100
                                               ,y: -100}
                                              ,{_: {}
                                               ,acc: 10
                                               ,ori: 5
                                               ,sz: 7
                                               ,x: -200
                                               ,y: -200}])
                     ,bullets: _L.fromArray([])
                     ,plane: {_: {}
                             ,acc: 0
                             ,ori: 0
                             ,sz: 8
                             ,x: 0
                             ,y: 0}
                     ,state: Playing
                     ,time: 0};
   var KI = F3(function (a,b,c) {
      return {ctor: "KI"
             ,_0: a
             ,_1: b
             ,_2: c};
   });
   var kInput = A2($Signal.sampleOn,
   heartbeat,
   A4($Signal.lift3,
   KI,
   $Keyboard.space,
   A2($Signal.lift,
   function (_) {
      return _.y;
   },
   $Keyboard.arrows),
   A2($Signal.lift,
   function (_) {
      return _.x;
   },
   $Keyboard.arrows)));
   var hlfSize = 250;
   var makeBounce = function (f) {
      return function () {
         var f2 = getNewFlying(f);
         return _U.cmp($Basics.abs(f.x) + f.sz,
         hlfSize) > -1 && _U.cmp($Basics.abs(f2.x) + f2.sz,
         hlfSize) > -1 ? _U.replace([["ori"
                                     ,$Basics.pi - f.ori]],
         f) : _U.cmp($Basics.abs(f.y) + f.sz,
         hlfSize) > -1 && _U.cmp($Basics.abs(f2.y) + f2.sz,
         hlfSize) > -1 ? _U.replace([["ori"
                                     ,0 - f.ori]],
         f) : f;
      }();
   };
   var deleteLeavers = function (bs) {
      return _U.eq(bs,
      _L.fromArray([])) ? _L.fromArray([]) : function () {
         var b = $List.head(bs);
         return _U.cmp($Basics.abs(b.x),
         hlfSize) > 0 || _U.cmp($Basics.abs(b.y),
         hlfSize) > 0 ? deleteLeavers($List.tail(bs)) : A2($List._op["::"],
         b,
         deleteLeavers($List.tail(bs)));
      }();
   };
   var borderAction = function (g) {
      return _U.replace([["plane"
                         ,makeBounce(g.plane)]
                        ,["bullets"
                         ,deleteLeavers(g.bullets)]
                        ,["asteroids"
                         ,A2($List.map,
                         makeBounce,
                         g.asteroids)]],
      g);
   };
   var changeGame = F2(function (_v4,
   g) {
      return function () {
         switch (_v4.ctor)
         {case "KI":
            return !_U.eq(g.state,
              Playing) && _v4._0 ? defaultGame : !_U.eq(g.state,
              Playing) && $Basics.not(_v4._0) ? g : advanceTime(collisionAction(borderAction(A2(changeGamey,
              _v4._2,
              A2(changeGamex,
              _v4._1,
              A2(changeGames,_v4._0,g))))));}
         _E.Case($moduleName,
         "between lines 138 and 140");
      }();
   });
   var gameState = A3($Signal.foldp,
   changeGame,
   defaultGame,
   kInput);
   var asteroidState = A2($Signal.lift,
   getAsteroids,
   gameState);
   var fSize = 500;
   var formsList = function (g) {
      return A2($List._op["::"],
      $Graphics$Collage.filled(bgColor)(A2($Graphics$Collage.rect,
      fSize,
      fSize)),
      A2($List._op["::"],
      A2(showPlane,
      {ctor: "_Tuple2"
      ,_0: g.plane.x
      ,_1: g.plane.y},
      g.plane.ori),
      A2($List._op["::"],
      A2($Graphics$Collage.move,
      {ctor: "_Tuple2",_0: 0,_1: 240},
      $Graphics$Collage.toForm(gameStateTxt(g))),
      _L.append(asteroidForms(g),
      bulletForms(g)))));
   };
   var display = F2(function (_v9,
   game) {
      return function () {
         switch (_v9.ctor)
         {case "_Tuple2":
            return A3($Graphics$Element.container,
              _v9._0,
              _v9._1,
              $Graphics$Element.middle)(A3($Graphics$Collage.collage,
              fSize,
              fSize,
              formsList(game)));}
         _E.Case($moduleName,
         "on line 203, column 3 to 62");
      }();
   });
   var main = A3($Signal.lift2,
   display,
   $Window.dimensions,
   gameState);
   _elm.Main.values = {_op: _op
                      ,fSize: fSize
                      ,hlfSize: hlfSize
                      ,KI: KI
                      ,Playing: Playing
                      ,Won: Won
                      ,Lost: Lost
                      ,Flying: Flying
                      ,Game: Game
                      ,defaultGame: defaultGame
                      ,heartbeat: heartbeat
                      ,kInput: kInput
                      ,getAsteroids: getAsteroids
                      ,changeGamex: changeGamex
                      ,changeGamey: changeGamey
                      ,doNtimes: doNtimes
                      ,changeGames: changeGames
                      ,getNext: getNext
                      ,getNewFlying: getNewFlying
                      ,getNewPos: getNewPos
                      ,advanceTime: advanceTime
                      ,makeBounce: makeBounce
                      ,deleteLeavers: deleteLeavers
                      ,borderAction: borderAction
                      ,noCollide: noCollide
                      ,noAstCollide: noAstCollide
                      ,noBulletCollide: noBulletCollide
                      ,filterBullets: filterBullets
                      ,filterAsteroids: filterAsteroids
                      ,collisionAction: collisionAction
                      ,changeGame: changeGame
                      ,gameState: gameState
                      ,asteroidState: asteroidState
                      ,gameStateTxt: gameStateTxt
                      ,showPlane: showPlane
                      ,bgColor: bgColor
                      ,make: make
                      ,make$: make$
                      ,showAsteroid: showAsteroid
                      ,showAsteroid$: showAsteroid$
                      ,mapNgon: mapNgon
                      ,asteroidForms: asteroidForms
                      ,toDot: toDot
                      ,mapToDot: mapToDot
                      ,bulletForms: bulletForms
                      ,formsList: formsList
                      ,display: display
                      ,main: main};
   return _elm.Main.values;
};