import { FileResources } from '../constants';
const fileBaseUrl = process.env.REACT_APP_RESOURCES_URL;

export const buildImagePath = (path: string, resource_type: string, size_mode: string) => {
  if (!path) {
    return FileResources.defaultPreview;
  }

  if (size_mode) {
    return `${fileBaseUrl}/${resource_type}/${size_mode}/${path}`;
  }

  return `${fileBaseUrl}/${resource_type}/${path}`;
};