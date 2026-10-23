------------------------------ INIT

function _init()
  -- frame = 0

  -- player_init()
  -- stars_init()
  -- shooting_init()
  -- enemies_init()
  -- explosions_init()
end

function _update()
  -- frame += 1

  -- player_update()
  -- stars_update()
  -- shooting_update()
  -- enemies_update()
  -- explosions_update()
end

function _draw()
  -- cls()--

  -- player_draw()
  -- shooting_draw()
  -- enemies_draw()
  -- explosions_draw()
  -- stars_draw()
end

------------------------------ PLAYER MOVEMENT
function player_init()
  player = {
    x = 64,
    y = 100,
  }
end

function player_update()
  if btn(0) then
    player.x -= 3
  end
  if btn(1) then
    player.x += 3
  end
  if btn(2) then
    player.y -= 3
  end
  if btn(3) then
    player.y += 3
  end
end

function player_draw()
  cls()
  spr(0, player.x, player.y)
end

------------------------------ FIX DIAGONAL MOVEMENT AND BOUNDS

function player_init()
  score = 0
  player = {
    x = 64,
    y = 100,
  }
end

function player_update()
  local move = { x = 0, y = 0 }

  if btn(➡️) then
    move.x += 3
  end
  if btn(⬅️) then
    move.x -= 3
  end
  if btn(⬆️) then
    move.y -= 3
  end
  if btn(⬇️) then
    move.y += 3
  end

  if move.x != 0 and move.y != 0 then
    move.x = move.x / 3 * 2
    move.y = move.y / 3 * 2
  end


  player.x += move.x
  player.y += move.y

  player.x = min(max(player.x, 0), 120)
  player.y = min(max(player.y, 0), 120)
end

function player_draw()
  spr(0, player.x, player.y)
end

------------------------------ STARS

function stars_init()
  stars = {}

  -- navy, gray, light gray/blue
  star_colors = { 1, 5, 13 }

  for i = 1, 30 do
    add(stars, {
      x = flr(rnd(128)),
      y = flr(rnd(256)) - 128,
      speed = 1 + rnd(2),
      color = star_colors[ceil(rnd(3))],
      r = flr(rnd(2))
    })
  end
end

function stars_update()
  for i = 1, #stars do
    stars[i].y = stars[i].y + stars[i].speed
    if stars[i].y > 127 then
      stars[i].x = flr(rnd(128))
      stars[i].y = flr(rnd(128)) * -1
    end
  end
end

function stars_draw()
  for i = 1, #stars do
    local y = stars[i].y
    local x = stars[i].x
    circfill(x, y, stars[i].r, stars[i].color)
  end
end

------------------------------ SHOOTING


function shooting_init()
  bullets = {}
  last_shot = -100
  shot_delay = 10
end

function shooting_update()
  if btn(❎) then
    if frame - last_shot > shot_delay then
      add(bullets, {
        x = player.x,
        y = player.y,
        dir = {
          x = 0,
          y = -3,
        }
      })
      sfx(0)
      last_shot = frame
    end
  end

  -- equivalent of javascript:
  -- for(let i = bullets.length, i >= 1, i--)
  for i = #bullets, 1, -1 do
    local bullet = bullets[i]
    bullet.x += bullet.dir.x
    bullet.y += bullet.dir.y

    if bullet.y < 0 then
      deli(bullets, i)
    end
  end
end

function shooting_draw()
  for i = 1, #bullets do
    local bullet = bullets[i]
    spr(1, bullet.x, bullet.y)
  end
end

------------------------------ ENEMIES and COLLISIONS

function collision(obj1, obj2)
  local dx = abs(obj1.x - obj2.x)
  local dy = abs(obj1.y - obj2.y)

  return dx < 8 and dy < 8
end

function spawn_enemy(y)
  local x = flr(rnd(120))
  y = y or flr(rnd(128)) * -1 - 8

  add(enemies, {
    x = x,
    y = y,
    dir = {
      x = flr(rnd(4)) - 2,
      y = 3 + flr(rnd(3))
    }
  })
end

function enemies_init()
  enemies = {}

  for i = 1, 5 do
    spawn_enemy(y)
  end
end

function enemies_update()
  -- make the game harder as it goes
  if #enemies < 30 and frame % 100 == 0 then
    spawn_enemy()
  end

  function spawn_enemy(y)
    local x = flr(rnd(120))
    y = y or flr(rnd(128)) * -1 - 8

    add(enemies, {
      x = x,
      y = y,
      dir = {
        x = flr(rnd(4)) - 2,
        y = 3 + flr(rnd(3))
      }
    })
  end

  for i = #enemies, 1, -1 do
    local enemy = enemies[i]
    enemy.x += enemy.dir.x
    enemy.y += enemy.dir.y

    if enemy.y > 127 then
      deli(enemies, i)
      spawn_enemy()
    end
  end

  -- bullet / enemy collisions
  for bullet_index = #bullets, 1, -1 do
    local bullet = bullets[bullet_index]

    for enemy_index = #enemies, 1, -1 do
      local enemy = enemies[enemy_index]

      if collision(enemy, bullet) then
        score += 100
        -- add_explosion(enemy.x, enemy.y)
        deli(bullets, bullet_index)
        deli(enemies, enemy_index)
        spawn_enemy()

        sfx(1)
        break
      end
    end
  end
end

function enemies_draw()
  for i = 1, #enemies do
    local enemy = enemies[i]
    spr(2, enemy.x, enemy.y)
  end
end

------------------------------ EXPLOSIONS
--- be sure to call add_explosion on collisons

function add_explosion(x, y, max)
  max = max or 10

  add(explosions, {
    x = x,
    y = y,
    frame = 1,
    max = max
  })
end

function explosions_init()
  explosions = {}
  explosion_colors = { 5, 8, 9, 10 }
end

function explosions_update()
  for i = #explosions, 1, -1 do
    local explosion = explosions[i]
    explosion.frame += 1

    if explosion.frame >= explosion.max then
      deli(explosions, i)
    end
  end
end

function explosions_draw()
  for i = #explosions, 1, -1 do
    local explosion = explosions[i]
    local x = explosion.x + rnd(4) - 2
    local y = explosion.y + rnd(4) - 2
    local color = explosion_colors[ceil(rnd(4))]
    circfill(x, y, rnd(8), color)
  end
end

------------------------------ PLAYER HP

function player_init()
  score = 0
  player = {
    x = 64,
    y = 100,
    hp = 3
  }
end

function player_update()
  if player.hp == 0 then
    return
  end

  local move = { x = 0, y = 0 }

  if btn(➡️) then
    move.x += 3
  end
  if btn(⬅️) then
    move.x -= 3
  end
  if btn(⬆️) then
    move.y -= 3
  end
  if btn(⬇️) then
    move.y += 3
  end

  if move.x != 0 and move.y != 0 then
    move.x = move.x / 3 * 2
    move.y = move.y / 3 * 2
  end


  player.x += move.x
  player.y += move.y

  player.x = min(max(player.x, 0), 120)
  player.y = min(max(player.y, 0), 120)

  -- player / enemy collisions
  for i = #enemies, 1, -1 do
    local enemy = enemies[i]

    if collision(enemy, player) then
      add_explosion(enemy.x, enemy.y)
      sfx(2)
      deli(enemies, i)
      spawn_enemy()
      player.hp -= 1

      if player.hp == 0 then
        sfx(3)
        add_explosion(player.x, player.y, 50)
      end
    end
  end
end

function player_draw()
  if player.hp > 0 then
    spr(0, player.x, player.y)
  end

  color(6) -- gray
  print("score:", 1, 1)
  color(9) -- orange
  print(score, 25, 1)

  for i = 1, 3 do
    if i > player.hp then
      spr(3, (i - 1) * 8, 120)
    else
      spr(4, (i - 1) * 8, 120)
    end
  end
end
