function getInitialState () {
  return {
    isFetching: false,
    isAdding: false,
    error: null,
    status: 'inactive',
    statuses: [],
    shares: []
  }
}

function getTestingState () {
  return {
    isFetching: false,
    isAdding: false,
    error: null,
    statuses: [{
      id: "01:23:45:67:89:00",
      serialnumber: '1-BA30-9ANALK',
      name: "Lightbulb 1",
      state: "on",
      isUpdating: false
    },{
      id: "01:23:45:67:89:01",
      serialnumber: '2-NKA-98Y07AH',
      name: "Lightbulb 2",
      state: "on",
      isUpdating: false
    },{
      id: "01:23:45:67:89:02",
      serialnumber: '3-897-HJA8O-7YSE',
      name: "Lightbulb 3",
      state: "on",
      isUpdating: false
    },{
      id: "01:23:45:67:89:03",
      serialnumber: '4-AI0-8YWGE-HSD',
      name: "Lightbulb 4",
      state: "off",
      isUpdating: false
    },{
      id: "01:23:45:67:89:04",
      serialnumber: '5-23GA-0876WEGA',
      name: "Lightbulb 5",
      state: "off",
      isUpdating: false
    }],
    shares: [
      {
        id: "01:23:45:67:89:00",
        serialnumber: '1-BA30-9ANALK',
        email: "pat@bar.baz"
      },
      {
        id: "01:23:45:67:89:00",
        serialnumber: '1-BA30-9ANALK',
        email: "george.clinton@wizzlewuzzle.com"
      }
    ],
    alerts: [
      {
        id: "01:23:45:67:89:00",
        serialnumber: '1-BA30-9ANALK',
        name: "Hours On",
        emails: [
          'you@youremail.com',
          'me@myemail.com',
          'him@hisemail.com'
        ]
      }
    ]
  }
}

function reducer (state, action) {
  if (state === undefined) { return getInitialState() }

  switch (action.type) {
    case 'ATTEMPT_REQUEST_STATES':
      return {
        ...state,
        status: 'good'
      }
    case 'ATTEMPT_REQUEST_SHARES':
      return {
        ...state,
        status: 'error',
        error: action.error
      }
    case 'ATTEMPT_TOGGLE_LIGHTBULB_STATE':
      return {
        ...state,
        statuses: state.statuses.map((status) => {
          if (status.serialnumber == action.serialnumber) {
            return {
              ...status,
              isUpdating: true
            }
          } else {
            return status
          }
        })
      }
    case 'TOGGLE_LIGHTBULB_STATE_SUCCESS':
      return {
        ...state,
        statuses: state.statuses.map((status) => {
          if (status.serialnumber == action.serialnumber) {
            return {
              ...status,
              isUpdating: false,
              state: action.state
            }
          } else {
            return status
          }
        })
      }
    case 'TOGGLE_LIGHTBULB_STATE_ERROR':
      console.log(JSON.stringify(state))
      return {
        ...state,
        statuses: state.statuses.map((status) => {
          if (status.serialnumber == action.serialnumber) {
            return {
              ...status,
              isUpdating: false,
              error: action.error
            }
          } else {
            return status
          }
        })
      }
    case 'REQUEST_LIGHTBULBS':
      return {
        ...state,
        isFetching: true
      }
    case 'REQUEST_LIGHTBULBS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        statuses: action.statuses
      }
    case 'REQUEST_LIGHTBULBS_ERROR':
      return {
        ...state,
        isFetching: false,
        error: action.error
      }
    case 'ATTEMPT_ADD_LIGHTBULB':
      return {
        ...state,
        isAdding: true
      }
    case 'ADD_LIGHTBULB_SUCCESS':
      return {
        ...state,
        isAdding: false
      }
    case 'ADD_LIGHTBULB_ERROR':
      return {
        ...state,
        isAdding: false, 
        error: action.error
      }
    case 'ATTEMPT_DELETE_LIGHTBULB':
      return {
        ...state,
        isDeleting: true
      }
    case 'DELETE_LIGHTBULB_SUCCESS':
      return {
        ...state,
        isDeleting: false,
        statuses: [...state.statuses.filter(
          (x) => x.serialnumber !== action.serialnumber
        )]
      }
    case 'DELETE_LIGHTBULB_ERROR':
      return {
        ...state,
        isDeleting: false,
        error: action.error
      }
    case 'ATTEMPT_SHARE':
      return {
        ...state,
        isSharing: true
      }
    case 'SHARE_SUCCESS':
      return {
        ...state,
        isSharing: false,
        shares: [...state.shares, {
          serialnumber: action.serialnumber,
          email: action.email,
          isUpdating: false
        }]
      }
    case 'SHARE_ERROR':
      return {
        ...state,
        isSharing: false,
        error: action.error
      }
    default:
      return state
  }
}

export default reducer
