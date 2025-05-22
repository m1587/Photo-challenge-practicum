export class Challenge {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public winnerImgId?: number | null,
        public winnerUserId?: number | null,
    ) { }
}