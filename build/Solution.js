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
   var makeTuple = function (_v0) {
      return function () {
         return {ctor: "_Tuple2"
                ,_0: _v0.x
                ,_1: _v0.y};
      }();
   };
   var bgColor = A3($Color.rgb,
   0,
   0,
   0);
   var segToForm = F3(function (width,
   color,
   ls) {
      return function () {
         var $ = ls,
         x1 = $.x1,
         y1 = $.y1,
         x2 = $.x2,
         y2 = $.y2;
         return $Graphics$Collage.traced(_U.replace([["width"
                                                     ,width]
                                                    ,["color",color]],
         $Graphics$Collage.defaultLine))(A2($Graphics$Collage.segment,
         {ctor: "_Tuple2",_0: x1,_1: y1},
         {ctor: "_Tuple2"
         ,_0: x2
         ,_1: y2}));
      }();
   });
   var getXMult = function (o) {
      return function () {
         switch (o.ctor)
         {case "E": return 1;
            case "W": return -1;}
         return 0;
      }();
   };
   var getYMult = function (o) {
      return function () {
         switch (o.ctor)
         {case "N": return 1;
            case "S": return -1;}
         return 0;
      }();
   };
   var getMovedPos = F3(function (_v4,
   ori,
   dist) {
      return function () {
         switch (_v4.ctor)
         {case "_Tuple2":
            return {ctor: "_Tuple2"
                   ,_0: _v4._0 + getXMult(ori) * dist
                   ,_1: _v4._1 + getYMult(ori) * dist};}
         _E.Case($moduleName,
         "on line 179, column 30 to 73");
      }();
   });
   var intersect = F2(function (l1,
   l2) {
      return _U.eq(l2.x1,
      l2.x2) && (_U.eq(l1.y1,
      l1.y2) && (_U.cmp(A2($Basics.min,
      l1.x1,
      l1.x2),
      l2.x1) < 1 && (_U.cmp(l2.x1,
      A2($Basics.max,
      l1.x1,
      l1.x2)) < 1 && (_U.cmp(A2($Basics.min,
      l2.y1,
      l2.y2),
      l1.y1) < 1 && _U.cmp(l1.y1,
      A2($Basics.max,
      l2.y1,
      l2.y2)) < 1)))) || _U.eq(l1.x1,
      l1.x2) && (_U.eq(l2.y1,
      l2.y2) && (_U.cmp(A2($Basics.min,
      l2.x1,
      l2.x2),
      l1.x1) < 1 && (_U.cmp(l1.x1,
      A2($Basics.max,
      l2.x1,
      l2.x2)) < 1 && (_U.cmp(A2($Basics.min,
      l1.y1,
      l1.y2),
      l2.y1) < 1 && _U.cmp(l2.y1,
      A2($Basics.max,
      l1.y1,
      l1.y2)) < 1))));
   });
   var getfirstSeg = function (_v8) {
      return function () {
         switch (_v8.ctor)
         {case "::": switch (_v8._1.ctor)
              {case "::": return {_: {}
                                 ,x1: _v8._1._0.x
                                 ,x2: _v8._0.x
                                 ,y1: _v8._1._0.y
                                 ,y2: _v8._0.y};}
              break;}
         _E.Case($moduleName,
         "on line 168, column 29 to 60");
      }();
   };
   var sampleAmountPs = 30;
   var sampleSignal = $Time.every($Time.second / sampleAmountPs);
   var stdMoveAmountPs = 100;
   var getMovedPlayer = function (p) {
      return function () {
         var newTS = _L.append($List.tail(p.prevpts),
         _L.fromArray([{_: {}
                       ,x: p.x
                       ,y: p.y}]));
         var $ = A3(getMovedPos,
         {ctor: "_Tuple2"
         ,_0: p.x
         ,_1: p.y},
         p.ori,
         $Basics.toFloat(stdMoveAmountPs) / sampleAmountPs),
         x2 = $._0,
         y2 = $._1;
         return _U.replace([["x",x2]
                           ,["y",y2]
                           ,["prevpts",newTS]],
         p);
      }();
   };
   var getNewplayers = function (pl) {
      return A2($List.map,
      getMovedPlayer,
      pl);
   };
   var advanceTime = function (g) {
      return {_: {}
             ,players: getNewplayers(g.players)
             ,state: g.state
             ,time: g.time + 1};
   };
   var playerH = 16;
   var playerW = 64;
   var tailLength = playerW * 4;
   var tailFrames = $Basics.floor($Basics.toFloat(tailLength) / ($Basics.toFloat(stdMoveAmountPs) / sampleAmountPs));
   var height = 768;
   var width = 1024;
   var ldc = {_: {}
             ,x1: (0 - width) / 2
             ,x2: (0 - width) / 2
             ,y1: (0 - height) / 2
             ,y2: (0 - height) / 2};
   var ruc = {_: {}
             ,x1: width / 2
             ,x2: width / 2
             ,y1: height / 2
             ,y2: height / 2};
   var getWallSegs = _L.fromArray([_U.replace([["y2"
                                               ,ruc.y2]],
                                  ldc)
                                  ,_U.replace([["x2",ruc.x2]],ldc)
                                  ,_U.replace([["y2",ldc.y2]],ruc)
                                  ,_U.replace([["x2",ldc.x2]],
                                  ruc)]);
   var Game = F3(function (a,b,c) {
      return {_: {}
             ,players: b
             ,state: a
             ,time: c};
   });
   var LineSeg = F4(function (a,
   b,
   c,
   d) {
      return {_: {}
             ,x1: a
             ,x2: c
             ,y1: b
             ,y2: d};
   });
   var Point = F2(function (a,b) {
      return {_: {},x: a,y: b};
   });
   var Player = F6(function (a,
   b,
   c,
   d,
   e,
   f) {
      return {_: {}
             ,clr: d
             ,id: e
             ,ori: c
             ,prevpts: f
             ,x: a
             ,y: b};
   });
   var Ended = {ctor: "Ended"};
   var Playing = {ctor: "Playing"};
   var NotStarted = {ctor: "NotStarted"};
   var KeyboardInput = F2(function (a,
   b) {
      return {_: {},x: a,y: b};
   });
   var KI = F3(function (a,b,c) {
      return {ctor: "KI"
             ,_0: a
             ,_1: b
             ,_2: c};
   });
   var kInput = A2($Signal.sampleOn,
   sampleSignal,
   A4($Signal.lift3,
   KI,
   $Keyboard.space,
   $Keyboard.arrows,
   $Keyboard.wasd));
   var W = {ctor: "W"};
   var S = {ctor: "S"};
   var E = {ctor: "E"};
   var defaultGame = {_: {}
                     ,players: _L.fromArray([{_: {}
                                             ,clr: $Color.lightGreen
                                             ,id: "Green Player"
                                             ,ori: W
                                             ,prevpts: A2($List.repeat,
                                             tailFrames,
                                             {_: {}
                                             ,x: $Basics.toFloat(width) / 2 - 49
                                             ,y: 0})
                                             ,x: $Basics.toFloat(width) / 2 - 50
                                             ,y: 0}
                                            ,{_: {}
                                             ,clr: $Color.lightRed
                                             ,id: "Red Player"
                                             ,ori: E
                                             ,prevpts: A2($List.repeat,
                                             tailFrames,
                                             {_: {}
                                             ,x: $Basics.toFloat(0 - width) / 2 + 49
                                             ,y: 0})
                                             ,x: (0 - $Basics.toFloat(width)) / 2 + 50
                                             ,y: 0}])
                     ,state: NotStarted
                     ,time: 0};
   var startedGame = _U.replace([["state"
                                 ,Playing]],
   defaultGame);
   var N = {ctor: "N"};
   var adjustDir = function (_v14) {
      return function () {
         switch (_v14.ctor)
         {case "_Tuple2":
            return function () {
                 var newOri = function () {
                    var _v18 = {ctor: "_Tuple2"
                               ,_0: _v14._0.x
                               ,_1: _v14._0.y};
                    switch (_v18.ctor)
                    {case "_Tuple2":
                       switch (_v18._0)
                         {case -1: switch (_v18._1)
                              {case 0: return W;}
                              break;
                            case 0: switch (_v18._1)
                              {case -1: return S;
                                 case 1: return N;}
                              break;
                            case 1: switch (_v18._1)
                              {case 0: return E;}
                              break;}
                         break;}
                    return _v14._1.ori;
                 }();
                 return _U.replace([["ori"
                                    ,newOri]],
                 _v14._1);
              }();}
         _E.Case($moduleName,
         "between lines 98 and 105");
      }();
   };
   var dir = function (seg) {
      return function () {
         var $ = {ctor: "_Tuple2"
                 ,_0: seg.x2 - seg.x1
                 ,_1: seg.y2 - seg.y1},
         xDiff = $._0,
         yDiff = $._1;
         return _U.eq(xDiff,
         0) ? _U.cmp(yDiff,
         0) > 0 ? S : N : _U.cmp(xDiff,
         0) > 0 ? W : E;
      }();
   };
   var pointsToSegs = function (pl) {
      return A3($List.foldl,
      F2(function (p,currList) {
         return function () {
            var seg1 = $List.head(currList);
            var newSeg = {_: {}
                         ,x1: p.x
                         ,x2: seg1.x1
                         ,y1: p.y
                         ,y2: seg1.y1};
            return !_U.eq(dir(seg1),
            dir(newSeg)) ? A2($List._op["::"],
            newSeg,
            currList) : function () {
               var changedSeg = {_: {}
                                ,x1: p.x
                                ,x2: seg1.x2
                                ,y1: p.y
                                ,y2: seg1.y2};
               return A2($List._op["::"],
               changedSeg,
               $List.tail(currList));
            }();
         }();
      }),
      _L.fromArray([getfirstSeg(pl)]),
      A2($List.drop,2,pl));
   };
   var getTailSegs = function (p) {
      return pointsToSegs($List.reverse(p.prevpts));
   };
   var getAllLineSegments = function (g) {
      return _L.append(getWallSegs,
      $List.concat(A2($List.map,
      getTailSegs,
      g.players)));
   };
   var getTailForms = function (p) {
      return A2($List.map,
      A2(segToForm,2,p.clr),
      getTailSegs(p));
   };
   var getLCSegments = function (p) {
      return function () {
         var ph = $Basics.toFloat(playerH);
         var $ = function () {
            var _v21 = p.ori;
            switch (_v21.ctor)
            {case "E":
               return {ctor: "_Tuple2"
                      ,_0: 0
                      ,_1: ph / 2};
               case "N":
               return {ctor: "_Tuple2"
                      ,_0: ph / 2
                      ,_1: 0};
               case "S":
               return {ctor: "_Tuple2"
                      ,_0: ph / 2
                      ,_1: 0};
               case "W":
               return {ctor: "_Tuple2"
                      ,_0: 0
                      ,_1: ph / 2};}
            _E.Case($moduleName,
            "between lines 126 and 131");
         }(),
         xOff = $._0,
         yOff = $._1;
         var $ = A3(getMovedPos,
         {ctor: "_Tuple2"
         ,_0: p.x
         ,_1: p.y},
         p.ori,
         $Basics.toFloat(playerW) / 20),
         x0 = $._0,
         y0 = $._1;
         var $ = A3(getMovedPos,
         {ctor: "_Tuple2"
         ,_0: p.x
         ,_1: p.y},
         p.ori,
         playerW),
         x2 = $._0,
         y2 = $._1;
         return pointsToSegs(_L.fromArray([{_: {}
                                           ,x: x0 + xOff
                                           ,y: y0 + yOff}
                                          ,{_: {}
                                           ,x: x0 - xOff
                                           ,y: y0 - yOff}
                                          ,{_: {}
                                           ,x: x2 - xOff
                                           ,y: y2 - yOff}
                                          ,{_: {}
                                           ,x: x2 + xOff
                                           ,y: y2 + yOff}
                                          ,{_: {}
                                           ,x: x0 + xOff
                                           ,y: y0 + yOff}]));
      }();
   };
   var noCollide = F2(function (p,
   l) {
      return $Basics.not(A2($List.any,
      intersect(l),
      getLCSegments(p)));
   });
   var noCollides = F2(function (p,
   lineSegList) {
      return A2($List.all,
      noCollide(p),
      lineSegList);
   });
   var lost = F2(function (p,g) {
      return $Basics.not(A2(noCollides,
      p,
      getAllLineSegments(g)));
   });
   var adjustState = function (g) {
      return A2($List.all,
      function (player) {
         return $Basics.not(A2(lost,
         player,
         g));
      },
      g.players) ? g : _U.replace([["state"
                                   ,Ended]],
      g);
   };
   var changeGame = F2(function (_v22,
   g) {
      return function () {
         switch (_v22.ctor)
         {case "KI":
            return !_U.eq(g.state,
              Playing) && _v22._0 ? startedGame : !_U.eq(g.state,
              Playing) && $Basics.not(_v22._0) ? g : advanceTime(adjustState(_U.replace([["players"
                                                                                         ,$List.map(adjustDir)(A3($List.zipWith,
                                                                                         F2(function (v0,
                                                                                         v1) {
                                                                                            return {ctor: "_Tuple2"
                                                                                                   ,_0: v0
                                                                                                   ,_1: v1};
                                                                                         }),
                                                                                         _L.fromArray([_v22._1
                                                                                                      ,_v22._2]),
                                                                                         g.players))]],
              g)));}
         _E.Case($moduleName,
         "between lines 63 and 71");
      }();
   });
   var gameState = A3($Signal.foldp,
   changeGame,
   defaultGame,
   kInput);
   var getWinText = function (g) {
      return $Text.asText(A2($List.map,
      function (p) {
         return A2(lost,
         p,
         g) ? _L.append(p.id,
         " has Lost!") : _L.append(p.id,
         " has Won!");
      },
      g.players));
   };
   var gameStateTxt = function (g) {
      return $Graphics$Element.color($Color.lightBlue)(function () {
         var _v27 = g.state;
         switch (_v27.ctor)
         {case "Ended":
            return getWinText(g);}
         return $Text.asText(g.state);
      }());
   };
   var lightCycleForm = function (p) {
      return A2($List.map,
      A2(segToForm,1,p.clr),
      getLCSegments(p));
   };
   var formsList = function (g) {
      return A2($List._op["::"],
      $Graphics$Collage.filled(bgColor)(A2($Graphics$Collage.rect,
      width,
      height)),
      _L.append(A2($List._op["::"],
      A2($Graphics$Collage.move,
      {ctor: "_Tuple2",_0: 0,_1: 240},
      $Graphics$Collage.toForm(gameStateTxt(g))),
      $List.concat(A2($List.map,
      getTailForms,
      g.players))),
      $List.concat(A2($List.map,
      lightCycleForm,
      g.players))));
   };
   var display = F2(function (_v28,
   game) {
      return function () {
         switch (_v28.ctor)
         {case "_Tuple2":
            return A3($Graphics$Element.container,
              _v28._0,
              _v28._1,
              $Graphics$Element.middle)(A3($Graphics$Collage.collage,
              width,
              height,
              formsList(game)));}
         _E.Case($moduleName,
         "on line 235, column 3 to 63");
      }();
   });
   var main = A3($Signal.lift2,
   display,
   $Window.dimensions,
   gameState);
   _elm.Main.values = {_op: _op
                      ,N: N
                      ,E: E
                      ,S: S
                      ,W: W
                      ,KI: KI
                      ,KeyboardInput: KeyboardInput
                      ,NotStarted: NotStarted
                      ,Playing: Playing
                      ,Ended: Ended
                      ,Player: Player
                      ,Point: Point
                      ,LineSeg: LineSeg
                      ,Game: Game
                      ,width: width
                      ,height: height
                      ,playerW: playerW
                      ,playerH: playerH
                      ,tailLength: tailLength
                      ,stdMoveAmountPs: stdMoveAmountPs
                      ,sampleAmountPs: sampleAmountPs
                      ,sampleSignal: sampleSignal
                      ,kInput: kInput
                      ,defaultGame: defaultGame
                      ,startedGame: startedGame
                      ,tailFrames: tailFrames
                      ,ldc: ldc
                      ,ruc: ruc
                      ,getWallSegs: getWallSegs
                      ,gameState: gameState
                      ,changeGame: changeGame
                      ,advanceTime: advanceTime
                      ,getNewplayers: getNewplayers
                      ,getMovedPlayer: getMovedPlayer
                      ,adjustState: adjustState
                      ,adjustDir: adjustDir
                      ,lost: lost
                      ,getAllLineSegments: getAllLineSegments
                      ,getTailSegs: getTailSegs
                      ,getLCSegments: getLCSegments
                      ,noCollides: noCollides
                      ,noCollide: noCollide
                      ,pointsToSegs: pointsToSegs
                      ,dir: dir
                      ,getfirstSeg: getfirstSeg
                      ,intersect: intersect
                      ,getMovedPos: getMovedPos
                      ,getYMult: getYMult
                      ,getXMult: getXMult
                      ,segToForm: segToForm
                      ,getTailForms: getTailForms
                      ,lightCycleForm: lightCycleForm
                      ,gameStateTxt: gameStateTxt
                      ,getWinText: getWinText
                      ,bgColor: bgColor
                      ,formsList: formsList
                      ,makeTuple: makeTuple
                      ,display: display
                      ,main: main};
   return _elm.Main.values;
};