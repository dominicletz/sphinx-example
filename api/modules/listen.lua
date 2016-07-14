-- websocket listener
-- expects messages with this format:
-- {
--   "cmd": "subscribe" | "unsubscribe",
--   "sn": <sn>,
--   "id": <request id>
-- }
-- it uses the session to check that the user has access to 
-- <sn>, and if so subscribes this websocket to them. Once 
-- subscribed, any time the device gateway service receives 
-- a datapoint from device <sn> it sends it back to the
-- websocket client in this format:
-- {
--   "sn": <sn>,
--   "alias": <resource-alias>,
--   "timestamp": <timestamp>,
--   "value": <value>
-- }
-- Responses to request
--   {"id": <request id>, "status": "ok"}       - success
--   {"id": <request id>, "status": "badargs"}  - invalid arguments
--   {"id": <request id>, "status": "noauth"}   - user does not have 
--                                                access to this device
--   {"status": "error"}                        - there was a big
--                                                problem (e.g. bad msg 
--                                                format)
function listen_response(status, id)
  response = {status=status}
  if id ~= nil then
    response.id = id
  end
  return response
end

function listen(websocket_info)
  local user = currentUserFromHeaders(websocket_info.headers)
  if user == nil then
    return listen_response("noauth", nil)
  end
  local msg = websocket_info.message
  if msg == nil then
    return listen_response("error", nil)
  end
  local msg = from_json(msg)
  if msg == nil then
    return listen_response("error", nil)
  end
  if msg.id ~= nil and msg.cmd ~= nil and msg.sn ~= nil then
    local cmd = tostring(msg.cmd)
    if cmd == 'subscribe' then
      return listen_subscribe(user, msg)
    elseif cmd == 'unsubscribe' then
      return listen_unsubscribe(user, msg)
    else 
      return listen_response("badargs", msg.id)
    end
  else
    -- missing id/cmd/sn
    return listen_response("badargs", msg.id)
  end
  return listen_response("ok", msg.id)
end

-- subscribe this websocket, if user has permissions
-- returns a listen websocket response 
-- when called, user, msg.id, msg.cmd, and msg.sn are non-nil
function listen_subscribe(user, msg, socket_id, server_ip)
  if not listen_user_has_access(user, msg.sn) then
    return listen_response("noauth", msg.id)
  end
  -- one socket per device for now
  local value = kv_read(sn)
  value.listen = {sn = sn, socket_id = socket_id, server_ip = server_ip}
  kv_write(sn, value)
  return listen_response("ok", msg.id)
end

-- unsubscribe this websocket from this device
-- when called, user msg.id, msg.cmd, and msg.sn are non-nil
function listen_unsubscribe(user, msg)
  return listen_response("TODO", msg.id)
end

function listen_user_has_access(user, sn)
  local isowner = User.hasUserRoleParam({
    id = user.id, role_id = "owner", parameter_name = "sn", parameter_value = sn
  })
  local isguest = User.hasUserRoleParam({
    id = user.id, role_id = "guest", parameter_name = "sn", parameter_value = sn
  })
  return isowner == 'OK' or isguest == 'OK'
end
