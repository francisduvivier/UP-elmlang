--Author: Francis Duvivier - s0215207
import Keyboard
import Window
-- Model
 --The field size
fSize=500
 --Half field size
hlfSize=250

data KInput = KI Bool Int Int
data State = Playing |Won|Lost
type Flying= {x:Float, y:Float, ori:Float, acc:Int, sz:Float}
type Plane =  Flying
type Bullet = Flying
type Asteroid =Flying
type Game = {state:State, plane:Plane, bullets:[Bullet] ,asteroids:[Asteroid], time:Time}


--Initial
defaultGame : Game 
defaultGame =
  { state=Playing, plane={x=0,y=0,ori=0, acc=0, sz=8}, bullets=[], 
  asteroids=[
    {x=100,y=100,ori=1, acc=2,sz=15},
    {x=150,y=-150,ori=2,acc=4,sz=10},
    {x=-150,y=150,ori=3,acc=6,sz=20},
    {x=-100,y=-100,ori=4,acc=8,sz=30},
    {x=-200,y=-200,ori=5,acc=10,sz=7}]
  , time= 0}

--Input
heartbeat : Signal Float
heartbeat = every (second/20)


kInput : Signal KInput
kInput = sampleOn heartbeat (
            lift3 KI Keyboard.space 
                       (lift (.y) Keyboard.arrows)
                       (lift (.x) Keyboard.arrows))

-- Updates

getAsteroids: Game -> [Asteroid]
getAsteroids g = g.asteroids

changeGamex: Int -> Game -> Game
changeGamex x g0 = 
  let plane0 =g0.plane 
    in let plane2 = {plane0 - acc| acc = plane0.acc+x}
      in {g0 - plane| plane=plane2}

changeGamey: Int -> Game -> Game
changeGamey y1 g0 =
  let plane0 =g0.plane 
    in let plane2 = {plane0 - ori| ori = plane0.ori+((toFloat y1)*(-0.1))}
      in {g0 - plane| plane=plane2}

doNtimes : Int->(a->a)->a->a
doNtimes k f a = if k<=0 then a else doNtimes (k-1) f (f a)

changeGames: Bool -> Game -> Game
changeGames space g = if space then
  let bullets2 = (doNtimes (4*(round g.plane.sz)) getNext {x=g.plane.x, y=g.plane.y, ori=g.plane.ori, acc=g.plane.acc+4, sz=1})::g.bullets
    in {g - bullets| bullets=bullets2}
  else g

getNext: Flying->Flying
getNext f=
  let (x,y)= getNewPos (f.x,f.y) f.ori 1
  in { f | x <- x, y <- y}


getNewFlying: Flying->Flying
getNewFlying f=
  let (x,y)= getNewPos (f.x,f.y) f.ori f.acc
  in { f | x <- x, y <- y}


getNewPos : (Float, Float) -> Float-> Int -> (Float, Float)
getNewPos (x,y) ori acc = ( x+(cos(ori)*(toFloat acc)*0.2) ,y+(sin(ori)*(toFloat acc)*0.2))


advanceTime: Game -> Game
advanceTime g = {
  state = g.state, 
  plane = getNewFlying g.plane, 
  bullets = map getNewFlying g.bullets,
  asteroids = map getNewFlying g.asteroids,
  time = g.time+1}

  --makes a flying object bounce if it's at a border
makeBounce: Flying -> Flying
makeBounce f=
  let f2=getNewFlying f
  in if (abs f.x)+f.sz >= hlfSize && (abs f2.x)+f2.sz >=hlfSize then
  {f|ori <- (pi-f.ori)}
  else if ((abs f.y)+f.sz) >= hlfSize && (abs f2.y)+f2.sz >=hlfSize then
      {f|ori <- (-f.ori)}
      else f

  
deleteLeavers: [Bullet] -> [Bullet]
deleteLeavers bs= if bs==[] then []
  else 
    let b=(head bs)in
    if  (abs b.x)>hlfSize||(abs b.y)>hlfSize then
    deleteLeavers (tail bs)
    else b::(deleteLeavers (tail bs))

borderAction: Game -> Game
borderAction g = {g|
  plane <- makeBounce g.plane,
  bullets <- deleteLeavers g.bullets,
  asteroids <- map makeBounce g.asteroids}

noCollide: Flying->Flying->Bool
noCollide f1 f2 = (sqrt ((f1.x-f2.x)^2 +(f1.y-f2.y)^2)) > (f1.sz+f2.sz)

noAstCollide: Game ->Flying -> Bool
noAstCollide g f= all (noCollide f) g.asteroids 

noBulletCollide: Game ->Asteroid -> Bool
noBulletCollide g a= all (noCollide a) g.bullets 

filterBullets g= filter  (noAstCollide g) g.bullets
filterAsteroids g= filter (noBulletCollide g) g.asteroids
collisionAction : Game ->Game
collisionAction g= let g2={g| 
  bullets <- filterBullets g,
  asteroids <- filterAsteroids g}
  in 
    if not ((noAstCollide g2) g.plane) then {g2| state<-Lost}
    else if g2.asteroids==[] then  {g2| state<-Won} 
    else g2

changeGame: KInput -> Game -> Game
changeGame (KI space x y) g= if (g.state/=Playing)&& space then defaultGame
  else if(g.state/=Playing) && not space then g
  else advanceTime( collisionAction(borderAction(changeGamey y (changeGamex x (changeGames space g)))))


gameState: Signal Game
gameState = foldp changeGame defaultGame kInput


asteroidState: Signal [Asteroid]
asteroidState =lift getAsteroids gameState




-- Display
gameStateTxt : Game-> Element
gameStateTxt g = asText ( g.state)
    
showPlane : (Float, Float) -> Float -> Form
showPlane pos orientation =
  move pos (rotate orientation  
    (filled white (polygon [(10,0),(-8,-5),(-4,0),(-8,5)])))

bgColor = rgb 120 120 120

make obj shape =  move (obj.x,obj.y) (filled white shape)
make' obj shape = shape |> filled white
                       |> move (obj.x,obj.y)
showAsteroid : (Float, Float) -> Float -> Form
showAsteroid pos diam = move pos (filled white (ngon 5 diam))

showAsteroid' : Asteroid -> Form
showAsteroid' a= showAsteroid (a.x,a.y) a.sz


mapNgon:[Asteroid] -> [Form]
mapNgon asteroids = map showAsteroid' asteroids

asteroidForms: Game -> [Form]
asteroidForms g = mapNgon g.asteroids


toDot :Bullet->Form
toDot b = move (b.x,b.y) (filled white (circle b.sz))

mapToDot:[Bullet] -> [Form]
mapToDot bs = map toDot bs

bulletForms: Game -> [Form]
bulletForms g = mapToDot g.bullets




formsList : Game->[Form]                       
formsList g=
  (rect fSize fSize |> filled bgColor)
  :: (showPlane (g.plane.x,g.plane.y) g.plane.ori)
  :: move (0,240) (toForm (gameStateTxt g))
  :: (asteroidForms g  
  ++ bulletForms g)
  
display : (Int,Int) -> Game -> Element
display (w,h) game =
  container w h middle <| collage fSize fSize (formsList game)
       
       
main = lift2 display Window.dimensions gameState