// api-flow.ts
import axios from "axios";

const BASE_URL = "http://localhost:80";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>, step: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn(`${step} failed, retrying once...`);
    await delay(1000);
    return await fn();
  }
}

async function availabilityCheck(apartmentId: string, label: string, checkIn: string, checkOut: string) {
  const res = await withRetry(() =>
    axios.get(`${BASE_URL}/search`, {
      params: { city: "bolzano", checkIn, checkOut },
      headers: { accept: "application/json" }
    }), label);
  console.log(`${label} status:`, res.status);
  const found = res.data.find((apt: any) => apt.id === apartmentId);
  console.log(`${label} (${checkIn}–${checkOut}) → Apartment present?`, !!found);
  return !!found;
}

async function categorizedCheck(label: string) {
  const res = await withRetry(() =>
    axios.get(`${BASE_URL}/apartments/Apartments/CategorizedApartments`, {
      headers: { accept: "text/plain" }
    }), label);
  console.log(`${label} status:`, res.status);

  const first = res.data?.categorizedApartments?.[0];
  if (first) {
    console.log(`${label} → Apartment ID: ${first.apartmentId}`);
    console.log(`ai generated category is: ${first.category}`);
  } else {
    console.log(`${label} → No categorized apartments returned`);
  }
}

async function main() {
  try {
    // 1. Add apartment
    const addRes = await withRetry(() =>
      axios.post(`${BASE_URL}/apartments/Apartments`, {
        name: "Palermo's Finest",
        address: "bolzano, via palermo 23",
        description: "apartment in a quiet area close to the city center",
        floor: 1,
        noiseLevel: 1,
        distanceToCenterInKm: 5,
        isVisible: true,
        areaInSquareMeters: 30,
        isFurnished: true,
        pricePerDay: 100
      }, {
        headers: { "Content-Type": "application/json", "accept": "text/plain" }
      }), "Add apartment");
    console.log("Apartment added:", addRes.status);
    await delay(1000);

    // 2. Search availability to get apartmentId
    let apartmentId: string | undefined;
    const searchRes = await withRetry(() =>
      axios.get(`${BASE_URL}/search`, {
        params: { city: "bolzano", checkIn: "2026-01-10", checkOut: "2026-01-11" },
        headers: { accept: "application/json" }
      }), "Initial availability search");
    apartmentId = searchRes.data[0]?.id;
    if (!apartmentId) {
      console.warn("No apartmentId found, retrying search...");
      await delay(1000);
      const retrySearch = await axios.get(`${BASE_URL}/search`, {
        params: { city: "bolzano", checkIn: "2026-01-10", checkOut: "2026-01-11" },
        headers: { accept: "application/json" }
      });
      apartmentId = retrySearch.data[0]?.id;
    }
    if (!apartmentId) throw new Error("ApartmentId not found after retry");
    console.log("Apartment ID:", apartmentId);
    await delay(1000);

        // Categorized apartments check after creation
    await categorizedCheck("Categorized apartments after creation");
    await delay(1000);

    // 3. Update apartment
    await withRetry(() =>
      axios.put(`${BASE_URL}/apartments/Apartments`, {
        id: apartmentId,
        name: "Palermo's Finest",
        address: "bolzano, via palermo 23",
        description: "premium apartment in a quiet area close to the city center",
        floor: 1,
        noiseLevel: 1,
        distanceToCenterInKm: 5,
        isVisible: true,
        areaInSquareMeters: 30,
        isFurnished: true,
        pricePerDay: 250
      }, {
        headers: { "Content-Type": "application/json", "accept": "text/plain" }
      }), "Update apartment");
    console.log("Apartment updated");
    await delay(1000);

    // Categorized apartments check after update
    await categorizedCheck("Categorized apartments after update");
    await delay(1000);

    // 4. Create booking (Jan 10–11)
    const bookingRes = await withRetry(() =>
      axios.post(`${BASE_URL}/booking/bookings`, {
        apartmentId,
        startDate: "2026-01-10",
        endDate: "2026-01-11"
      }, {
        headers: { "Content-Type": "application/json", "accept": "text/plain" }
      }), "Create booking");
    console.log("Booking created:", bookingRes.status);

    let bookingId: string | undefined = bookingRes.data?.booking?._id;
    if (!bookingId) {
      console.warn("No bookingId returned, retrying booking creation...");
      await delay(1000);
      const retryBooking = await axios.post(`${BASE_URL}/booking/bookings`, {
        apartmentId,
        startDate: "2026-01-10",
        endDate: "2026-01-11"
      }, {
        headers: { "Content-Type": "application/json", "accept": "text/plain" }
      });
      bookingId = retryBooking.data?.booking?._id;
    }
    if (!bookingId) throw new Error("BookingId not found after retry");
    console.log("Booking ID:", bookingId);
    await delay(1000);

    // 4b. Availability check after booking (10–11 should be unavailable)
    await availabilityCheck(apartmentId, "Availability after booking", "2026-01-10", "2026-01-11");
    await delay(1000);

    // 5. Update booking (to Jan 13–15)
    await withRetry(() =>
      axios.put(`${BASE_URL}/booking/bookings/${bookingId}`, {
        startDate: "2026-01-13",
        endDate: "2026-01-15"
      }, {
        headers: { "Content-Type": "application/json", "accept": "text/plain" }
      }), "Update booking");
    console.log("Booking updated");
    await delay(1000);

    // 5b. Availability check after booking update
    await availabilityCheck(apartmentId, "Availability after booking update (old window)", "2026-01-10", "2026-01-11");
    await availabilityCheck(apartmentId, "Availability after booking update (new window)", "2026-01-13", "2026-01-15");
    await delay(1000);

    // 6. Delete booking
    await withRetry(() =>
      axios.delete(`${BASE_URL}/booking/bookings/${bookingId}`, {
        headers: { "Content-Type": "application/json", "accept": "text/plain" }
      }), "Delete booking");
    console.log("Booking deleted");
    await delay(1000);

    // 6b. Availability check after booking deletion (both windows should be available again)
    await availabilityCheck(apartmentId, "Availability after booking deletion (old window)", "2026-01-10", "2026-01-11");
    await availabilityCheck(apartmentId, "Availability after booking deletion (new window)", "2026-01-13", "2026-01-15");
    await delay(1000);

    // 7. Delete apartment
    await withRetry(() =>
      axios.delete(`${BASE_URL}/apartments/Apartments`, {
        data: { id: apartmentId },
        headers: { "Content-Type": "application/json", "accept": "text/plain" }
      }), "Delete apartment");
    console.log("Apartment deleted");
    await delay(1000);

    // 8. Final availability search (apartment should be gone permanently)
    await availabilityCheck(apartmentId, "Final availability search", "2026-01-10", "2026-01-11");
    await availabilityCheck(apartmentId, "Final availability search (new window)", "2026-01-13", "2026-01-15");
  } catch (err: any) {
    console.error("Error in flow:", err.message);
  }
}

main();