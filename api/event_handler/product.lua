--[[
  data
  The data from the device

  data.api enum string (write|record)
  Provider API

  data.rid string
  Unique device resource id

  data.seq integer
  The message sequence number for specific resource id

  data.alias string
  Device resource alias

  data.value table{1 = "live"|timestamp, 2 = value}
  Data transmitted by the device

  data.vendor string
  Device vendor identifier

  data.device_sn string
  Device Serial number

  data.source_ip string
  The device source ip

  data.timestamp integer
  Event time
--]]

Timeseries.write({
  query = data.alias .. ",sn=" .. data.device_sn .. " value=" .. tostring(data.value[2])
})
local value = kv_read(data.device_sn)
if value == nil then
  value = {
    humidity = nil,
    temperature = nil,
    state = nil
  }
end
value[data.alias] = data.value[2]
-- store the last timestamp from this device
value["timestamp"] = data.timestamp/1000
value["pid"] = data.vendor or data.pid
value["ip"] = data.source_ip
value["rid"] = data.rid

if value.alerts ~= nil and data.alias == "state" then
  local timerid = data.device_sn .. "_state"
  for _ ,alert in ipairs(value.alerts) do
    if alert.state == value.state then --condition true
      if alert.active and not alert.timer_running then --enabled, not running
        trigger(alert, timerid)
      end
    end
    if not alert.active and alert.timer_running then --disabled, running
      cancel_trigger(alert)
    end
  end
end

local listen = value.listen
if listen ~= nil and listen.sn ~= nil and listen.socket_id ~= nil and listen.server_ip then
  if data.device_sn == listen.sn then
    local msg = {
      sn = listen.sn, 
      alias = data.alias, 
      timestamp = data.value[1],
      value = data.value[2]
    }
    Websocket.send({
      socket_id = listen.socket_id,
      server_ip = listen.server_ip,
      message = to_json(msg),
      type="data-text"
    })
  end
end
kv_write(data.device_sn, value)
