import {ResultStatus} from '../types/resultStatus-enum';
import {HttpStatusCode} from '../types/httpStatus-enum';


export function resultStatusToHttpCode(status: string ): number {
    switch(status) {
        case ResultStatus.Success :
            return HttpStatusCode.Success_200

        case ResultStatus.Created :
            return HttpStatusCode.Created_201

        case ResultStatus.NoContent :
            return HttpStatusCode.NoContent_204

        case ResultStatus.BadRequest :
            return HttpStatusCode.BadRequest_400

        case ResultStatus.Unauthorized :
            return HttpStatusCode.Unauthorized_401

        case ResultStatus.Forbidden :
            return HttpStatusCode.Forbidden_403

        case ResultStatus.NotFound :
            return HttpStatusCode.NotFound_404

        default :
            return HttpStatusCode.ServerError_500
    }
}