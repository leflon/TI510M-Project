<script setup>
import {computed} from 'vue';
import BigButton from './BigButton.vue';
import {ArrowUpRightIcon, ClockIcon} from '@heroicons/vue/24/outline';
const props = defineProps({
    trip: Object,
    showLink: {
        type: Boolean,
        default: true
    },
    showLinkToBooking: {
        type: Boolean,
        default: false
    },
    bookingId: String
});

const duration = computed(() => {
    const departure = new Date(props.trip.departure_time);
    const arrival = new Date(props.trip.arrival_time);
    const diffMs = arrival - departure;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h${String(diffMins).padStart(2, '0')}m`;
});

function formattedTime(date) {
    const dateObj = new Date(date);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function formattedDay(date) {
    const dateObj = new Date(date);
    const options = {weekday: 'short', month: 'short', day: 'numeric'};
    let formattedDate = dateObj.toLocaleDateString('en-US', options);

    if (dateObj.getFullYear() !== new Date().getFullYear()) {
        formattedDate += `, ${dateObj.getFullYear()}`;
    }

    return formattedDate;
}

</script>

<template>
    <div class='trip-details'>
        <div class='trip-info'>
            <div class='trip-stop departure'>
                <div class='timing'>
                    <div class='day'>{{ formattedDay(trip.departure_time) }}</div>
                    <div class="time">{{ formattedTime(trip.departure_time) }}</div>
                </div>
                <div class='city'>{{ trip.departure_station.city }}</div>
                <div class='station'>{{ trip.departure_station.name }}</div>
            </div>
            <div class='trip-time'>
                <div class="line"></div>
                <ClockIcon style='width: 16px; height: 16px'></ClockIcon>
                <div class="duration">{{ duration }}</div>
            </div>
            <div class='trip-stop arrival'>
                <div class='timing'>
                    <div class='day'>{{ formattedDay(trip.arrival_time) }}</div>
                    <div class="time">{{ formattedTime(trip.arrival_time) }}</div>
                </div>
                <div class='city'>{{ trip.arrival_station.city }}</div>
                <div class='station'>{{ trip.arrival_station.name }}</div>
            </div>
        </div>
        <div class='confirm' v-if='showLink'>
            <RouterLink :to='`/booking_process/${trip.id}`'>
                <BigButton>
                    <div>Book</div>
                    <ArrowUpRightIcon style="width: 16px; height: 16px;"></ArrowUpRightIcon>
                </BigButton>
            </RouterLink>
        </div>
        <div class='confirm' v-else-if='showLinkToBooking'>
            <RouterLink :to='`/booking/${bookingId}`'>
                <BigButton>
                    <div>View booking</div>
                    <ArrowUpRightIcon style="width: 16px; height: 16px;"></ArrowUpRightIcon>
                </BigButton>
            </RouterLink>
        </div>
    </div>
</template>

<style>
.trip-details {
    position: relative;
    width: 70%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid #ddd;
    background-color: white;
    padding: 10px 15px;
    margin: 10px 0;
    border-radius: 10px;
}

.trip-info {
    display: flex;
    padding: 0 5px;
    flex: 1;
}

.trip-detail-bar {
    display: flex;
    justify-content: space-between;
    background-color: rgb(26, 51, 33);
    border-radius: 4px;
}

.trip-stop {
    /*display: flex;*/
}

.trip-stop.arrival {
    text-align: right;
}

.trip-stop .day {
    font: 300 10pt 'Fira Sans';
    transform: translateY(5pt);
    color: #555;
}

.trip-stop .time {
    font: 700 30pt 'Outfit';
}

.trip-stop .city {
    font: italic 300 11pt 'Fira Sans';
    color: #555;
}

.trip-stop .station {
    font: 600 14pt 'Outfit';
}

.trip-time {
    position: relative;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
}

.trip-time .duration {
    background-color: white;
    z-index: 2;
    padding: 10px;
}

.trip-time svg {
    position: absolute;
    top: 40%;
    transform: translateY(-100%);
    z-index: 3;
}

.trip-time .line {
    width: 100%;
    height: 1px;
    border-top: 1px dashed #ddd;
    position: absolute;
    top: 50%;
}

.confirm {
    padding: 0 10px;

    & a {
        text-decoration: none;
    }
}
</style>
