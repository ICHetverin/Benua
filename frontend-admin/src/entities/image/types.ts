export interface ImageDto {
  _id: string;
  text: string;
  url_to_s3: string; // Jackson SNAKE_CASE: urlToS3 → url_to_s3
}
