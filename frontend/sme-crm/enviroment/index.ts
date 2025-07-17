export interface EnviromentVariables {
  googleMapsApiKey: string;
}

export const getEnviromentVariables = (): EnviromentVariables => {
  const variables = {
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  };

  return variables;
};