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

    // First, sort photos by creation time
    const sortedPhotos = [...photos].sort((a, b) => {
        const timeA = a.creationTime || 0;
        const timeB = b.creationTime || 0;
        return timeB - timeA; // Newest first
    });

    sortedPhotos.forEach((photo) => {
        // Use creationTime if available, otherwise use modificationTime
        const timestamp =
            photo.creationTime || photo.modificationTime || Date.now();
        const date = new Date(timestamp);

        // Ensure we have a valid date
        if (isNaN(date.getTime())) {
            console.warn("Invalid date for photo:", photo);
            return;
        }

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

    // Sort groups by year and month (newest first)
    return Object.values(groups).sort((a, b) => {
        if (a.year !== b.year) {
            return b.year - a.year; // Newer years first
        }
        return monthNameToNumber(b.month) - monthNameToNumber(a.month); // Newer months first
    });
};
