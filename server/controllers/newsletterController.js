import Subscriber from '../models/Subscriber.js';

export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }

        const existingSubscriber = await Subscriber.findOne({ email: normalizedEmail });
        if (existingSubscriber) {
            return res.json({ success: true, message: "You are already subscribed" });
        }

        await Subscriber.create({ email: normalizedEmail });
        res.json({ success: true, message: "Subscribed successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
