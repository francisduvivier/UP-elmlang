-- CPL: Soltion Elm Assignment December 2014
--Author: Francis Duvivier - s0215207
import Color
import Keyboard
import Window
-----------datas and types-----------
data Orientation = N | E | S | W
data KInput = KI Bool  KeyboardInput KeyboardInput
type KeyboardInput={x:Int,y:Int}
data State = NotStarted|Playing | Ended
type Player= {x:Float, y:Float, ori:Orientation, clr:Color,id:String,prevpts:[Point]}
type Point= {x:Float, y:Float}
type LineSeg={x1:Float,y1:Float,x2:Float,y2:Float}
type Game = {state:State, players:[Player], time:Time}

-----------Game configuration parameters-----------
width = 1024
height = 768
playerW = 64
playerH = 16
tailLength=playerW*4
stdMoveAmountPs = 100
sampleAmountPs = 30

-----------Input Signal-----------
sampleSignal : Signal Float
sampleSignal = every (second/sampleAmountPs)

kInput : Signal KInput
kInput = sampleOn sampleSignal (
            lift3 
                KI 
                Keyboard.space 
                Keyboard.arrows
                Keyboard.wasd)

-----------Initial game state configuration-----------
defaultGame : Game 
defaultGame =
  {state=NotStarted,
  players=
    [{x=(toFloat width)/2-50,y=0,ori=W,clr= Color.lightGreen,id="Green Player",prevpts=(repeat tailFrames {x=(toFloat width)/2-49,y=0})},
    {x=-(toFloat width)/2+50,y=0,ori=E,clr=Color.lightRed,id="Red Player",prevpts=(repeat tailFrames {x=(toFloat -width)/2+49,y=0})}]
  , time= 0
  }
startedGame:Game
startedGame = {defaultGame|state<-Playing}
tailFrames=floor <|((toFloat tailLength)/((toFloat stdMoveAmountPs)/sampleAmountPs))

--Line Segments representing the walls
ldc:LineSeg --lineSegment that goes from the most left-down corner to the  most left-down corner
ldc={x1=-width/2,y1=-height/2,x2=-width/2,y2=-height/2}
ruc:LineSeg --lineSegment that goes from the most right-up corner to the  most right-up corner
ruc={x1=width/2,y1=height/2,x2=width/2,y2=height/2}
getWallSegs: [LineSeg]
getWallSegs= [{ldc|y2<-ruc.y2},{ldc|x2<-ruc.x2},{ruc|y2<-ldc.y2},{ruc|x2<-ldc.x2}]

-----------Game state Changing code-----------
gameState: Signal Game
gameState = foldp changeGame defaultGame kInput
changeGame: KInput -> Game -> Game
changeGame (KI space pi1 pi2) g= 
    if (g.state/=Playing)&& space then startedGame
    else if (g.state/=Playing) && not space then g
    else advanceTime 
        <|adjustState
        <|{g|
        players <- 
            map adjustDir 
            <|zipWith (,) [pi1,pi2] g.players
        }
advanceTime: Game -> Game
advanceTime g = 
    {
    state=g.state,
    players=getNewplayers g.players,
    time = g.time+1}

getNewplayers: [Player]->[Player]
getNewplayers pl= map getMovedPlayer pl

getMovedPlayer: Player->Player
getMovedPlayer p = 
    let 
        (x2,y2)=
            (getMovedPos (p.x,p.y) p.ori ((toFloat stdMoveAmountPs)/sampleAmountPs)) 
        newTS = (tail p.prevpts)++[{x=p.x,y=p.y}]
    in {p|x<-x2,y<-y2,prevpts<-newTS}

adjustState: Game-> Game
adjustState g=
    if  all (\player -> not <|lost player g) g.players
    then g
    else {g|state<-Ended}

adjustDir: (KeyboardInput,Player) -> Player
adjustDir ({x,y},p) = 
    let newOri= 
        case (x,y) of
            (1,0)-> E
            ((-1),0)-> W
            (0,1) -> N
            (0,(-1))-> S
            _ -> p.ori
    in {p|ori<-newOri}



-----------State Calculation helper code-----------
lost: Player-> Game-> Bool
lost p g=not <| noCollides p (getAllLineSegments g)

getAllLineSegments: Game -> [LineSeg]
getAllLineSegments g= getWallSegs
     ++ (concat <|map getTailSegs g.players)

getTailSegs: Player->[LineSeg]
getTailSegs p=  pointsToSegs  <| reverse p.prevpts

getLCSegments: Player -> [LineSeg]
getLCSegments p= 
    let 
        (x2,y2)=getMovedPos (p.x, p.y) p.ori playerW
        (x0,y0)=getMovedPos (p.x, p.y) p.ori ((toFloat playerW)/20)
        ph=(toFloat playerH)
        (xOff,yOff) = case p.ori of
                N -> (ph/2,0)
                E -> (0,ph/2)
                S -> (ph/2,0)
                W -> (0,ph/2)
    in pointsToSegs [
        {x=x0+xOff,y=y0+yOff},{x=x0-xOff,y=y0-yOff},
        {x=x2-xOff,y=y2-yOff},{x=x2+xOff,y=y2+yOff},
        {x=x0+xOff,y=y0+yOff}
        ]

noCollides: Player->[LineSeg]->Bool
noCollides p lineSegList= all (noCollide p) lineSegList

noCollide: Player->LineSeg->Bool
noCollide p l= not <| any (intersect l) (getLCSegments p)

-----------Mathematics calculations helper code-----------
pointsToSegs: [Point]->[LineSeg]
pointsToSegs pl= foldl 
    (\p currList-> 
        let 
            seg1=(head currList)
            newSeg={x1=p.x,y1=p.y,x2=seg1.x1,y2=seg1.y1}
        in 
            if (dir seg1) /= (dir newSeg)
            then (newSeg::currList)
            else 
                let changedSeg={x1=p.x,y1=p.y,x2=seg1.x2,y2=seg1.y2}
                in (changedSeg :: tail currList)
        ) [getfirstSeg pl] (drop 2 pl)

dir: LineSeg -> Orientation
dir seg= 
    let (xDiff,yDiff)=((seg.x2-seg.x1),(seg.y2-seg.y1))
    in 
        if xDiff==0 then
            if yDiff>0 then S else N
        else 
            if xDiff>0 then W else E

getfirstSeg:[Point]->LineSeg
getfirstSeg (p1::p2::rest)={x1=p2.x,y1=p2.y,x2=p1.x,y2=p1.y}

intersect: LineSeg->LineSeg->Bool
intersect l1 l2=
    (l2.x1==l2.x2 && l1.y1==l1.y2 && 
        (min l1.x1 l1.x2)<=l2.x1 && l2.x1<=(max l1.x1 l1.x2) && (min l2.y1 l2.y2)<=l1.y1 && l1.y1<=(max l2.y1 l2.y2) )
    ||
    (l1.x1==l1.x2 && l2.y1==l2.y2&& 
        (min l2.x1 l2.x2)<=l1.x1 && l1.x1<=(max l2.x1 l2.x2) && (min l1.y1 l1.y2)<=l2.y1 && l2.y1<=(max l1.y1 l1.y2) )

getMovedPos: (Float,Float) -> Orientation -> Float -> (Float,Float)
getMovedPos (x,y) ori dist= (x+(getXMult ori)*dist,y+(getYMult ori)*dist)

getYMult: Orientation->Float       
getYMult o= case o of
                N-> 1
                S-> -1
                _-> 0

getXMult: Orientation->Float       
getXMult o= case o of
                E-> 1
                W-> -1
                _-> 0

-----------Code for graphics-----------
segToForm:Float->Color->LineSeg ->Form
segToForm  width color ls =
            let {x1,y1,x2,y2}= ls
            in traced {defaultLine |
                width <- width,
                color <- color
                } <|segment (x1,y1) (x2,y2) 

getTailForms: Player ->[Form]
getTailForms p= map (segToForm 2 p.clr) (getTailSegs p)

lightCycleForm:Player ->[Form]
lightCycleForm p= 
    map (segToForm 1 p.clr) (getLCSegments p)

gameStateTxt : Game-> Element
gameStateTxt g =
    color Color.lightBlue <|
    case g.state of
        Ended -> getWinText g
        _ -> asText (g.state)

getWinText:Game ->Element
getWinText g= asText <|
    map (\p-> 
        if lost p g 
        then (p.id++" has Lost!")
        else (p.id++" has Won!")) 
        g.players
bgColor = rgb 0 0 0
formsList : Game->[Form]                       
formsList g= 
  (rect width height |> filled bgColor)
  :: (move (0,240) (toForm (gameStateTxt g))
  :: concat (map getTailForms g.players))
  ++ concat (map lightCycleForm g.players)

makeTuple: Point->(Float,Float)
makeTuple {x,y}=(x,y)
display : (Int,Int) -> Game -> Element
display (w,h) game =
  container w h middle <| collage width height (formsList game)
       
main = lift2 display Window.dimensions gameState
