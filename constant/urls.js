import { API_SERVER } from './apis'

/* User 相关 API */
export const API_USER_REGISTER       = API_SERVER + '/Register'
export const API_USER_LOGIN          = API_SERVER + '/Login'
export const API_USER_CLOCK_INFO     = API_SERVER + '/ClockInfo'
export const API_USER_CLOCK          = API_SERVER + '/Clock'
export const API_USER_FACE_UPLOAD    = API_SERVER + '/FaceUpload'
export const API_USER_FACE_CHECK     = API_SERVER + '/FaceCheck'
export const API_USER_H_W            = API_SERVER + '/heightweight'
export const API_CAL_TABLES          = API_SERVER + '/visualize/showBaseTables'



/* Leave 相关 API */
export const API_CONTENT_UPLOAD      = API_SERVER + '/UploadFile'
export const API_LEAVE_APPLY_LEAVE = API_SERVER + '/leave/ApplyLeave'
export const API_FOOD_POST = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY"
export const API_BAIDUTRANS_POST = "http://api.fanyi.baidu.com/api/trans/vip/translate"
export const API_GET_NUTRIATION = API_SERVER+'/getnutriation'
export const API_POST_NUTRIATION = API_SERVER+'/postnutriation'

/* Cal 相关 API */
export const API_CAL_GET_CARD_BY_MONTH = API_SERVER + '/cal/getCardByMonth'
export const API_CAL_GET_CARD_BY_DAY   = API_SERVER + '/cal/getCardByDay'
export const API_CAL_ADD_HEALTH_DATA = API_SERVER + '/cal/AddHealthData'



/* Conf 相关 API */
export const API_CONF_SAVE_CARDSCHE = API_SERVER + '/SaveCardSche'
export const API_CONF_LOAD_CARDSCHE = API_SERVER + '/LoadCardSche'


/* Comp 相关 API */
export const API_COMP_POS_LIST = API_SERVER + '/CompPosList'
export const API_COMP_DEPT_LIST = API_SERVER + '/CompDeptList'

/* content 相关 API */
export const API_CONTENT_POS_LIST = API_SERVER + '/cont/ContPosList'
export const API_DELETE_POS_LIST = API_SERVER + '/cont/ContDeleteList'
export const API_GET_CONTENT_LIST = API_SERVER + '/cont/ContgetList'
export const API_BALABALA_POS_LIST = API_SERVER + '/cont/ContBalabalaList'
export const API_NOPAGE_POS_LIST = API_SERVER + '/cont/ContNoPageList'
export const API_GET_ANNOUNCE_LIST = API_SERVER + '/cont/AnngetList'
export const API_ANNOUNCE_POS_LIST = API_SERVER + '/leave/AnnPosList'


export const HOST_IMG = API_SERVER + '/'
