export enum EGatewayRouts {
    jwt = 'jwt',
    issue = 'issue',
    validate = 'validate',
    decode = 'decode',
    cookies = 'cookies',
    setCookies = 'set',
    readCookies = 'read',

    test = 'test'
}

export enum EUsersRouts {
    auth = 'auth',
    signup = 'signup',
    signin = 'signin',
    user = 'user',
    updatePassword = 'update-password',
    subscribeToNewPostsNotifier = 'subscribe-to-new-posts',
}

export enum EBlogRouts {
    actions = 'actions',
    post = 'post',
    rePublish = 'republish',
    repost = 'repost',
    like = 'like',
    comment = 'comment',

    info = 'info',
    posts = 'posts',
    one = 'one',
    user = 'user',
    drafts = 'drafts',
    type = 'type',
    tag = 'tag',
    comments = 'comments',
    search = 'search',

    feed = 'feed',
}
