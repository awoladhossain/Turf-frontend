import api from './api';

export interface SlotGenerationResponse {
  success: boolean;
  message: string;
  count?: number;
}

export interface SlotsCleanupResponse {
  success: boolean;
  message: string;
  count?: number;
}

export interface TurfImageUploadResponse {
  imageUrl: string;
}

export interface TurfImageDeleteResponse {
  success: boolean;
}

class AdminService {
  /**
   * Generate slots for all active turfs for the next 7 days.
   */
  async generateSlots(): Promise<SlotGenerationResponse> {
    const response = await api.post<SlotGenerationResponse>('/admin/slots/generate');
    return response.data;
  }

  /**
   * Generate slots for a specific turf for a number of days.
   */
  async generateSlotsForTurf(turfId: string, days?: number): Promise<SlotGenerationResponse> {
    const response = await api.post<SlotGenerationResponse>(
      `/admin/slots/generate/turf/${turfId}`,
      {},
      {
        params: days ? { days } : undefined,
      }
    );
    return response.data;
  }

  /**
   * Clean up old slots (e.g. unbooked slots in the past).
   */
  async cleanUpOldSlots(): Promise<SlotsCleanupResponse> {
    const response = await api.post<SlotsCleanupResponse>('/admin/slots/cleanup');
    return response.data;
  }

  /**
   * Upload an image for a specific turf.
   */
  async uploadTurfImage(turfId: string, imageFile: File): Promise<TurfImageUploadResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post<TurfImageUploadResponse>(
      `/admin/upload/turf/${turfId}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Delete an image from a specific turf.
   */
  async deleteTurfImage(turfId: string, imageUrl: string): Promise<TurfImageDeleteResponse> {
    const response = await api.delete<TurfImageDeleteResponse>(
      `/admin/upload/turf/${turfId}/image`,
      {
        data: { imageUrl },
      }
    );
    return response.data;
  }
}

const adminService = new AdminService();
export default adminService;
