import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'

class UserPermissions {
    getCameraPermission = async () => {
        if (Constants.platform.ios){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status != "granted"){
                alert ("passa a permissão otario")
            }
        }
    }
}

export default new UserPermissions();