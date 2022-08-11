interface publicationType {
    profileId: number | string,
    publicationId: number | string,
    title: string,
    imageuri: string,
    description: string,
    author: string,
    avatar: string,
    collect: number | string,
    likes: number | string,
    view: number | string
}

export default publicationType