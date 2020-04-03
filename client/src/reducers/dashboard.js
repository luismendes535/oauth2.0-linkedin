import { 
  DASHBOARD_GET_DATA, 
  AUTH_LINK_LINKEDIN,
  AUTH_UNLINK_LINKEDIN,
} from '../actions/types';

const DEFAULT_STATE = {
  secret: '',
  methods: []
}

export default (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case AUTH_LINK_LINKEDIN:
      return { ...state, methods: action.payload.methods }
    case AUTH_UNLINK_LINKEDIN:
      return { ...state, methods: action.payload.methods }
    case DASHBOARD_GET_DATA:
      return { ...state, secret: action.payload.secret, methods: action.payload.methods }
    default:
      return state
  }
}