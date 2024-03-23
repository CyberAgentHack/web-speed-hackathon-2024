export type WriteImageFunction = ({ filepath, imageData }: { filepath: string; imageData: ImageData }) => Promise<void>;
