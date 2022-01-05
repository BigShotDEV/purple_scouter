export default class ColourGenerator {
    constructor() {
        this.defaultColour = [191, 115, 25];
        this.colourModifiers = [3, 15, 25];

        this.nextColour = [this.defaultColour[0]-this.colourModifiers[0], 
                           this.defaultColour[1]-this.colourModifiers[1],
                           this.defaultColour[2]-this.colourModifiers[2]];
        this.names = {};
    }

    generateNew = (stackName, isNewStack, defense) => {
        if (isNewStack !== undefined && isNewStack) {
            this.nextColour = this.defaultColour;
            return this.nextColour;
        };

        if(stackName !== undefined && stackName in this.names){
            this.names[stackName]++;
            return [this.defaultColour[0] + this.colourModifiers[0]*this.names[stackName], 
                    this.defaultColour[1] + this.colourModifiers[1]*this.names[stackName], 
                    this.defaultColour[2] + this.colourModifiers[2]*this.names[stackName]];
        } else if (stackName !== undefined) {
            this.names[stackName] = 0;
            return this.defaultColour
        }

        this.nextColour[0] += this.colourModifiers[0];
        this.nextColour[1] += this.colourModifiers[1];
        this.nextColour[2] += this.colourModifiers[2];
        return this.nextColour;
    }
}