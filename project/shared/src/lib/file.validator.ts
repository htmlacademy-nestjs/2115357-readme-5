import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator'
import {MemoryStoredFile} from 'nestjs-form-data'
import {appConfig} from '../configs/app.config'

export enum EAllowedUploadedAvatarMimeTypes {
    jpg = 'image/jpg',
    jpeg = 'image/jpeg',
    png = 'image/png',
}
export enum EAllowedUploadedPostPhotoMimeTypes {
    jpg = 'image/jpg',
    jpeg = 'image/jpeg',
    png = 'image/png',
}

export function convertToBytes(fileLengthInMegabytes:number) {
    return fileLengthInMegabytes * 10**6
}

@ValidatorConstraint({ name: 'file-validator', async: false })
export class FileValidator implements ValidatorConstraintInterface {
    errors: string[] = []
    validate(avatar: MemoryStoredFile, options:any) {
        const maxFileSize = +options.constraints[0]
        while(this.errors.length) {
            this.errors.pop()
        }
        if(!avatar) {
            return true
        }
        const errors = []
        if(!(avatar as any).busBoyMimeType) {
            errors.push(`Allowed file mime-types: ${Object.values(EAllowedUploadedAvatarMimeTypes).join(' | ')}`)
        }
        if(!Object.values(EAllowedUploadedAvatarMimeTypes).includes((avatar as any).busBoyMimeType as EAllowedUploadedAvatarMimeTypes)) {
            errors.push(`Allowed file mime-types: ${Object.values(EAllowedUploadedAvatarMimeTypes).join(' | ')}`)
        }
        if(!(+avatar.size > 0 && +avatar.size <= maxFileSize)) {
            errors.push(`File size must be > 0 && <= ${maxFileSize}`)
        }
        this.errors.push(...[...new Set(errors)])
        return !(this.errors.length)
    }
    defaultMessage() {
        return this.errors.join('; ')
    }
}
