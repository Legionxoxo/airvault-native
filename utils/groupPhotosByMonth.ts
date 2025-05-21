import * as MediaLibrary from "expo-media-library";

export interface PhotoGroup {
    month: string;
    year: number;
    photos: MediaLibrary.Asset[];
}

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const monthNameToNumber = (monthName: string): number => {
    return monthNames.indexOf(monthName);
};

export const groupPhotosByMonth = (
    photos: MediaLibrary.Asset[]
): PhotoGroup[] => {
    const groups: Record<string, PhotoGroup> = {};

    photos.forEach((photo) => {
        const creationTime =
            photo.creationTime && photo.creationTime > 0
                ? photo.creationTime
                : Date.now();
        const date = new Date(creationTime);
        const monthYear = `${date.getFullYear()}-${date.getMonth()}`;

        if (!groups[monthYear]) {
            groups[monthYear] = {
                month: monthNames[date.getMonth()],
                year: date.getFullYear(),
                photos: [],
            };
        }

        groups[monthYear].photos.push(photo);
    });

    return Object.values(groups).sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return monthNameToNumber(b.month) - monthNameToNumber(a.month);
    });
};
