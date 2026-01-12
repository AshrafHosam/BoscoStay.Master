"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// api-flow.ts
var axios_1 = require("axios");
var BASE_URL = "http://localhost:80";
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function withRetry(fn, step) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 5]);
                    return [4 /*yield*/, fn()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_1 = _a.sent();
                    console.warn("".concat(step, " failed, retrying once..."));
                    return [4 /*yield*/, delay(1000)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, fn()];
                case 4: return [2 /*return*/, _a.sent()];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function availabilityCheck(apartmentId, label, checkIn, checkOut) {
    return __awaiter(this, void 0, void 0, function () {
        var res, found;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withRetry(function () {
                        return axios_1.default.get("".concat(BASE_URL, "/search"), {
                            params: { city: "bolzano", checkIn: checkIn, checkOut: checkOut },
                            headers: { accept: "application/json" }
                        });
                    }, label)];
                case 1:
                    res = _a.sent();
                    console.log("".concat(label, " status:"), res.status);
                    found = res.data.find(function (apt) { return apt.id === apartmentId; });
                    console.log("".concat(label, " (").concat(checkIn, "\u2013").concat(checkOut, ") \u2192 Apartment present?"), !!found);
                    return [2 /*return*/, !!found];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var addRes, apartmentId_1, searchRes, retrySearch, bookingRes, bookingId_1, retryBooking, err_2;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 31, , 32]);
                    return [4 /*yield*/, withRetry(function () {
                            return axios_1.default.post("".concat(BASE_URL, "/apartments/Apartments"), {
                                name: "Palermo's Finest",
                                address: "bolzano, via palermo 23",
                                description: "string",
                                floor: 0,
                                noiseLevel: 0,
                                distanceToCenterInKm: 0,
                                isVisible: true,
                                areaInSquareMeters: 0,
                                isFurnished: true,
                                pricePerDay: 100
                            }, {
                                headers: { "Content-Type": "application/json", "accept": "text/plain" }
                            });
                        }, "Add apartment")];
                case 1:
                    addRes = _g.sent();
                    console.log("Apartment added:", addRes.status);
                    return [4 /*yield*/, delay(1000)];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, withRetry(function () {
                            return axios_1.default.get("".concat(BASE_URL, "/search"), {
                                params: { city: "bolzano", checkIn: "2026-01-10", checkOut: "2026-01-11" },
                                headers: { accept: "application/json" }
                            });
                        }, "Initial availability search")];
                case 3:
                    searchRes = _g.sent();
                    apartmentId_1 = (_a = searchRes.data[0]) === null || _a === void 0 ? void 0 : _a.id;
                    if (!!apartmentId_1) return [3 /*break*/, 6];
                    console.warn("No apartmentId found, retrying search...");
                    return [4 /*yield*/, delay(1000)];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, axios_1.default.get("".concat(BASE_URL, "/search"), {
                            params: { city: "bolzano", checkIn: "2026-01-10", checkOut: "2026-01-11" },
                            headers: { accept: "application/json" }
                        })];
                case 5:
                    retrySearch = _g.sent();
                    apartmentId_1 = (_b = retrySearch.data[0]) === null || _b === void 0 ? void 0 : _b.id;
                    _g.label = 6;
                case 6:
                    if (!apartmentId_1)
                        throw new Error("ApartmentId not found after retry");
                    console.log("Apartment ID:", apartmentId_1);
                    return [4 /*yield*/, delay(1000)];
                case 7:
                    _g.sent();
                    // 3. Update apartment
                    return [4 /*yield*/, withRetry(function () {
                            return axios_1.default.put("".concat(BASE_URL, "/apartments/Apartments"), {
                                id: apartmentId_1,
                                name: "Palermo's Finest Updated",
                                address: "bolzano, via palermo 23",
                                description: "updated description",
                                floor: 1,
                                noiseLevel: 2,
                                distanceToCenterInKm: 1,
                                isVisible: true,
                                areaInSquareMeters: 50,
                                isFurnished: false,
                                pricePerDay: 120
                            }, {
                                headers: { "Content-Type": "application/json", "accept": "text/plain" }
                            });
                        }, "Update apartment")];
                case 8:
                    // 3. Update apartment
                    _g.sent();
                    console.log("Apartment updated");
                    return [4 /*yield*/, delay(1000)];
                case 9:
                    _g.sent();
                    return [4 /*yield*/, withRetry(function () {
                            return axios_1.default.post("".concat(BASE_URL, "/booking/bookings"), {
                                apartmentId: apartmentId_1,
                                startDate: "2026-01-10",
                                endDate: "2026-01-11"
                            }, {
                                headers: { "Content-Type": "application/json", "accept": "text/plain" }
                            });
                        }, "Create booking")];
                case 10:
                    bookingRes = _g.sent();
                    console.log("Booking created:", bookingRes.status);
                    bookingId_1 = (_d = (_c = bookingRes.data) === null || _c === void 0 ? void 0 : _c.booking) === null || _d === void 0 ? void 0 : _d._id;
                    if (!!bookingId_1) return [3 /*break*/, 13];
                    console.warn("No bookingId returned, retrying booking creation...");
                    return [4 /*yield*/, delay(1000)];
                case 11:
                    _g.sent();
                    return [4 /*yield*/, axios_1.default.post("".concat(BASE_URL, "/booking/bookings"), {
                            apartmentId: apartmentId_1,
                            startDate: "2026-01-10",
                            endDate: "2026-01-11"
                        }, {
                            headers: { "Content-Type": "application/json", "accept": "text/plain" }
                        })];
                case 12:
                    retryBooking = _g.sent();
                    bookingId_1 = (_f = (_e = retryBooking.data) === null || _e === void 0 ? void 0 : _e.booking) === null || _f === void 0 ? void 0 : _f._id;
                    _g.label = 13;
                case 13:
                    if (!bookingId_1)
                        throw new Error("BookingId not found after retry");
                    console.log("Booking ID:", bookingId_1);
                    return [4 /*yield*/, delay(1000)];
                case 14:
                    _g.sent();
                    // 4b. Availability check after booking (10–11 should be unavailable)
                    return [4 /*yield*/, availabilityCheck(apartmentId_1, "Availability after booking", "2026-01-10", "2026-01-11")];
                case 15:
                    // 4b. Availability check after booking (10–11 should be unavailable)
                    _g.sent();
                    return [4 /*yield*/, delay(1000)];
                case 16:
                    _g.sent();
                    // 5. Update booking (to Jan 13–15)
                    return [4 /*yield*/, withRetry(function () {
                            return axios_1.default.put("".concat(BASE_URL, "/booking/bookings/").concat(bookingId_1), {
                                startDate: "2026-01-13",
                                endDate: "2026-01-15"
                            }, {
                                headers: { "Content-Type": "application/json", "accept": "text/plain" }
                            });
                        }, "Update booking")];
                case 17:
                    // 5. Update booking (to Jan 13–15)
                    _g.sent();
                    console.log("Booking updated");
                    return [4 /*yield*/, delay(1000)];
                case 18:
                    _g.sent();
                    // 5b. Availability check after booking update
                    // Old window (10–11) should now be available
                    return [4 /*yield*/, availabilityCheck(apartmentId_1, "Availability after booking update (old window)", "2026-01-10", "2026-01-11")];
                case 19:
                    // 5b. Availability check after booking update
                    // Old window (10–11) should now be available
                    _g.sent();
                    // New window (13–15) should be unavailable
                    return [4 /*yield*/, availabilityCheck(apartmentId_1, "Availability after booking update (new window)", "2026-01-13", "2026-01-15")];
                case 20:
                    // New window (13–15) should be unavailable
                    _g.sent();
                    return [4 /*yield*/, delay(1000)];
                case 21:
                    _g.sent();
                    // 6. Delete booking
                    return [4 /*yield*/, withRetry(function () {
                            return axios_1.default.delete("".concat(BASE_URL, "/booking/bookings/").concat(bookingId_1), {
                                headers: { "Content-Type": "application/json", "accept": "text/plain" }
                            });
                        }, "Delete booking")];
                case 22:
                    // 6. Delete booking
                    _g.sent();
                    console.log("Booking deleted");
                    return [4 /*yield*/, delay(1000)];
                case 23:
                    _g.sent();
                    // 6b. Availability check after booking deletion (both windows should be available again)
                    return [4 /*yield*/, availabilityCheck(apartmentId_1, "Availability after booking deletion (old window)", "2026-01-10", "2026-01-11")];
                case 24:
                    // 6b. Availability check after booking deletion (both windows should be available again)
                    _g.sent();
                    return [4 /*yield*/, availabilityCheck(apartmentId_1, "Availability after booking deletion (new window)", "2026-01-13", "2026-01-15")];
                case 25:
                    _g.sent();
                    return [4 /*yield*/, delay(1000)];
                case 26:
                    _g.sent();
                    // 7. Delete apartment
                    return [4 /*yield*/, withRetry(function () {
                            return axios_1.default.delete("".concat(BASE_URL, "/apartments/Apartments"), {
                                data: { id: apartmentId_1 },
                                headers: { "Content-Type": "application/json", "accept": "text/plain" }
                            });
                        }, "Delete apartment")];
                case 27:
                    // 7. Delete apartment
                    _g.sent();
                    console.log("Apartment deleted");
                    return [4 /*yield*/, delay(1000)];
                case 28:
                    _g.sent();
                    // 8. Final availability search (apartment should be gone permanently)
                    return [4 /*yield*/, availabilityCheck(apartmentId_1, "Final availability search", "2026-01-10", "2026-01-11")];
                case 29:
                    // 8. Final availability search (apartment should be gone permanently)
                    _g.sent();
                    return [4 /*yield*/, availabilityCheck(apartmentId_1, "Final availability search (new window)", "2026-01-13", "2026-01-15")];
                case 30:
                    _g.sent();
                    return [3 /*break*/, 32];
                case 31:
                    err_2 = _g.sent();
                    console.error("Error in flow:", err_2.message);
                    return [3 /*break*/, 32];
                case 32: return [2 /*return*/];
            }
        });
    });
}
main();
