-- Check event type (could be: "data_in" | "connect" | "disconnect" )
if event.type == "data_in" then
  data_timestamp = event.payload[1].timestamp
  full_payload = event.payload[1].values

  data = {
    ["alias"] = "",
    ["value"] = {},
    ["device_sn"] = "",
    ["source_ip"] = ""
  }

  for key, value in pairs(full_payload) do
    -- For each resource alias included in this event's payload:
    -- build-out the old "data" object from the new "event" object
    data.alias = key
    data.value[1] = data_timestamp
    data.value[2] = value
    data.device_sn = event.identity
    data.source_ip = event.ip

    -- Example approach for creating historical log of data using TSDB Service
    local metrics = {
      [data.alias] = tostring(data.value[2])
    }
    local tags = {
      pid = data.pid,
      sn = data.device_sn
    }
    Tsdb.write({
      metrics = metrics, 
      tags = tags
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
    value["timestamp"] = data.value[1]/1000
    value["ip"] = data.source_ip
  
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
  end
end
