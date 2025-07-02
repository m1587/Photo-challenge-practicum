export class Challenge {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public startDate: string,
        public endDate: string,
        public winnerImageUrl?: string | null,
        public winnerUserName?: string | null,
    ) { }
}