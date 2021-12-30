export default class ColourGenerator {
    constructor() {
        this.nextColour = [196, 100, 0];
        this.names = {};
    }

    generateNew = (stackName, isNewStack, defense) => {
        if (isNewStack !== undefined && isNewStack) {
            this.nextColour = [199, 115, 25];
            return this.nextColour;
        };

        if(stackName !== undefined && stackName in this.names){
            this.names[stackName]++;
            return [199 + 3*this.names[stackName], 115 +15*this.names[stackName], 25 + 25*this.names[stackName]];
        } else if (stackName !== undefined) {
            this.names[stackName] = 0;
            return [199, 115, 25]
        }

        this.nextColour[0] += 3;
        this.nextColour[1] += 15;
        this.nextColour[2] += 25;
        return this.nextColour;
    }
}