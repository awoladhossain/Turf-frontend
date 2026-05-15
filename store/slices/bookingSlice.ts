import { Slot, Turf } from '@/types/turf.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CouponData {
  code: string;
  discount: number;
  finalAmount: number;
  originalAmount: number;
}

interface BookingState {
  selectedTurf: Turf | null;
  selectedSlot: Slot | null;
  selectedDate: string | null;
  appliedCoupon: CouponData | null;
  notes: string;
}

const initialState: BookingState = {
  selectedTurf: null,
  selectedSlot: null,
  selectedDate: null,
  appliedCoupon: null,
  notes: '',
};
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedTurf: (state, action: PayloadAction<Turf>) => {
      state.selectedTurf = action.payload;
      // Turf বদলালে slot reset করো
      state.selectedSlot = null;
      state.appliedCoupon = null;
    },

    setSelectedSlot: (state, action: PayloadAction<Slot>) => {
      state.selectedSlot = action.payload;
    },

    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
      state.selectedSlot = null; // Date বদলালে slot reset
    },

    applyCoupon: (state, action: PayloadAction<CouponData>) => {
      state.appliedCoupon = action.payload;
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },

    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },

    resetBooking: () => initialState,
  },
});

export const {
  setSelectedTurf,
  setSelectedSlot,
  setSelectedDate,
  applyCoupon,
  removeCoupon,
  setNotes,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
