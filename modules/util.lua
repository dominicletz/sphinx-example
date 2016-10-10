-- get current logged in user from webservice request
-- returns user table or nil if no user is contained 
-- in headers
function currentUser(request)
  return currentUserFromHeaders(request.headers)
end

-- determine the current user from the session information
-- stored in webservice or websocket request headers.
-- returns user table or nil if no user is contained 
-- in headers
function currentUserFromHeaders(headers)
  if type(headers.cookie) ~= "string" then
    return nil
  end
  local _, _, sid = string.find(headers.cookie, "sid=([^;]+)")
  if type(sid) ~= "string" then
    return nil
  end
  local user = User.getCurrentUser({token = sid})
  if user ~= nil and user.id ~= nil then
    user.token = sid
    return user
  end
  return nil
end

function table.contains(table, element)
  for _, value in pairs(table) do
    if value == element then
      return true
    end
  end
  return false
end

-- default a particular key in a table to value
-- if that index already exists, otherwise does nothing.
function default(t, key, defaultValue) 
  if not table.contains(t, key) then
    t[key] = defaultValue
  end
end

-- read the latest values for a lightbulb device
-- from the key value database
function kv_read(sn)
  local resp = Keystore.get({key = "sn_" .. sn})
  local device = nil
  if type(resp) == "table" and type(resp.value) == "string" then
    -- device has written. Get the latest written values
    device = from_json(resp.value)
  end

  return device
end

-- store device settings to the key value store
function kv_write(sn, values)
  Keystore.set({key = "sn_" .. sn, value = to_json(values)})
end

function device_write(sn, alias, value)
  local device = kv_read(sn)
  if device.pid == nil then
    return {status="ERROR", reason="device needs to send data first"}
  end

  -- save to keystore
  kv_write(sn, {[alias]=value})

  -- push to device
  return Device.write({
    pid=device.pid,
    device_sn=sn,
    [alias]=value
  })
end

http_error_codes = {
  [400] = {
    code = 400,
    message = "Bad Request",
    headers = {}
  },
  [403] = {
    code = 403,
    message = "Permission Denied",
    headers = {}
  },
  [404] = {
    code = 404,
    message = "Not Found",
    headers = {}
  }
}

function http_error(code, response)
  if http_error_codes[code] ~= nil then
    for key, value in pairs(http_error_codes[code]) do
      response[key] = value
    end
  else
    response.code = code
    response.message = "No prepared message for this code"
  end
end

function trigger(alert, timerid)
  Timer.sendAfter({
    message = alert.message,
    duration = alert.timer * 60 * 1000,
    timer_id = timerid
  })
  alert.timer_running = true
  alert.timer_id = timerid
end

function cancel_trigger(alert)
  Timer.cancel({timer_id = alert.timer_id})
  alert.timer_running = false
end
