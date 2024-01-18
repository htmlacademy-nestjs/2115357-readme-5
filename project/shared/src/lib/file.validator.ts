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
