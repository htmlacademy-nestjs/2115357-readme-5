import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator"

enum EYoutubeHosts {
    full = 'youtube.com',
    short = 'youtu.be'
}

@ValidatorConstraint({ name: 'is-youtube-link', async: false })
export class IsYoutubeLink implements ValidatorConstraintInterface {
  validate(link: string, args: ValidationArguments) {
    if(!link || typeof link !== 'string') {
        return false
    }
    return link.includes(EYoutubeHosts.full) || link.includes(EYoutubeHosts.short)
  }
  defaultMessage(args: ValidationArguments) {
    if(!args.value) {
        return `youtubeVideoUrl must be a valid youtube video url`
    }
    return `${args.value} is not a valid youtube video link`
  }
}