export function generateRandomString(): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const maxLength = 10;
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < maxLength; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }

    return result;
}

export function createUniqueStringArray(length: number): string[] {
    const uniqueStrings = new Set<string>();

    while (uniqueStrings.size < length) {
        uniqueStrings.add(generateRandomString());
    }

    return Array.from(uniqueStrings);
}
