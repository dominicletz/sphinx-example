local ret1 = User.createRole({role_id = "owner", parameter = {{name = "sn"}}})
local ret2 = User.createRole({role_id = "guest", parameter = {{name = "sn"}}})
local ret = ret1.status_code ~= nil and ret1 or nil
if ret == nil then
  ret = ret2.status_code ~= nil and ret2 or nil
end
if ret ~= nil then
  response.code = ret.status_code
  response.message = ret.message
else
  response.code = 200
end
