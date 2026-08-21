<?php
/**
 * Galedi Corps - Contact Form Mailer Endpoint
 * Hostinger PHP Mailer for Astro Static Website
 * Recipient: info@galedicorps.com
 */

// Set JSON response header & CORS headers
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method Not Allowed. Please send a POST request.'
    ]);
    exit;
}

// Destination corporate email
$to_email = 'info@galedicorps.com';

// Read JSON input payload or standard POST payload
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true);

if (!$data || !is_array($data)) {
    $data = $_POST;
}

// Extract and sanitize input fields
$name         = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$email        = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';
$company      = isset($data['company']) ? trim(strip_tags($data['company'])) : '-';
$phone        = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '-';
$inquiry_type = isset($data['inquiry_type']) ? trim(strip_tags($data['inquiry_type'])) : 'general';
$message      = isset($data['message']) ? trim(htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8')) : '';

// Validation checks
if (empty($name) || strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide a valid name (at least 2 characters).']);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide a valid email address.']);
    exit;
}

if (empty($message) || strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide a message with at least 10 characters.']);
    exit;
}

// Map inquiry type code to human-readable label
$inquiry_labels = [
    'general'     => 'General Corporate Inquiry',
    'partnership' => 'Strategic Brand Partnership & Incubation',
    'mice'        => 'Corporate Travel & MICE Retreats',
    'scent'       => 'OEM Perfumery & Ambient Scenting',
    'events'      => 'Event Production & Custom Packaging',
    'hr'          => 'Human Capital Consulting & Training',
    'media'       => 'Media & Editorial Collaboration'
];

$inquiry_label = isset($inquiry_labels[$inquiry_type]) ? $inquiry_labels[$inquiry_type] : ucwords(str_replace('_', ' ', $inquiry_type));

// Prevent Email Header Injection by removing newlines from sender details
$clean_name = str_replace(["\r", "\n"], '', $name);
$clean_email = str_replace(["\r", "\n"], '', $email);

// Email Subject
$subject = "[Galedi Corps Inquiry] " . $inquiry_label . " - " . $clean_name;

// Timestamp (WIB: Asia/Jakarta)
date_default_timezone_set('Asia/Jakarta');
$timestamp = date('d F Y, H:i') . ' WIB';
$client_ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

// Build Luxury HTML Email Template
$body_html = '
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . htmlspecialchars($subject) . '</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #1e1e1b; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e2da; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
        .header { background-color: #1e1e1b; color: #fbf9f5; padding: 32px 28px; text-align: left; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; color: #ffffff; }
        .header p { margin: 0; font-size: 13px; color: #a3a199; font-weight: 300; }
        .badge { display: inline-block; background-color: #5c634d; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 12px; }
        .content { padding: 28px; }
        .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #8c8a82; font-weight: 600; margin-bottom: 12px; }
        .grid { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .grid td { padding: 10px 0; border-bottom: 1px solid #f0ede6; font-size: 14px; }
        .grid td.label { width: 35%; color: #706e68; font-weight: 400; }
        .grid td.value { width: 65%; color: #1e1e1b; font-weight: 500; }
        .message-box { background-color: #fbf9f5; border-left: 3px solid #5c634d; padding: 18px; border-radius: 0 10px 10px 0; font-size: 14px; line-height: 1.6; color: #2c2b28; margin-bottom: 28px; white-space: pre-wrap; }
        .footer { background-color: #fbf9f5; border-top: 1px solid #edeae2; padding: 20px 28px; font-size: 12px; color: #8c8a82; text-align: left; line-height: 1.5; }
        .reply-btn { display: inline-block; background-color: #1e1e1b; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-size: 13px; font-weight: 500; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>GALEDI CORPS</h1>
            <p>New Website Contact Inquiry</p>
            <div class="badge">' . htmlspecialchars($inquiry_label) . '</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="section-title">Client Information</div>
            <table class="grid">
                <tr>
                    <td class="label">Full Name</td>
                    <td class="value"><strong>' . htmlspecialchars($name) . '</strong></td>
                </tr>
                <tr>
                    <td class="label">Email Address</td>
                    <td class="value"><a href="mailto:' . htmlspecialchars($email) . '" style="color: #5c634d; text-decoration: none;">' . htmlspecialchars($email) . '</a></td>
                </tr>
                <tr>
                    <td class="label">Company / Brand</td>
                    <td class="value">' . htmlspecialchars($company) . '</td>
                </tr>
                <tr>
                    <td class="label">Phone Number</td>
                    <td class="value">' . htmlspecialchars($phone) . '</td>
                </tr>
                <tr>
                    <td class="label">Inquiry Category</td>
                    <td class="value">' . htmlspecialchars($inquiry_label) . '</td>
                </tr>
            </table>

            <div class="section-title">Message Details</div>
            <div class="message-box">' . nl2br($message) . '</div>

            <a href="mailto:' . htmlspecialchars($email) . '?subject=Re:%20' . rawurlencode($subject) . '" class="reply-btn">Reply to ' . htmlspecialchars($name) . ' &rarr;</a>
        </div>

        <!-- Footer -->
        <div class="footer">
            Submitted via <strong>galedicorps.com/connect</strong> on ' . $timestamp . '<br />
            Sender IP: ' . htmlspecialchars($client_ip) . '
        </div>
    </div>
</body>
</html>
';

// Setup email headers for Hostinger
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Galedi Corps Website <" . $to_email . ">\r\n";
$headers .= "Reply-To: " . $clean_name . " <" . $clean_email . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Send the email using PHP mail() (Hostinger default)
$mail_sent = @mail($to_email, $subject, $body_html, $headers);

if ($mail_sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you. Your inquiry has been sent successfully to info@galedicorps.com.'
    ]);
} else {
    // If native mail failed, return error for client retry
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Unable to send message at this moment. Please email info@galedicorps.com directly.'
    ]);
}
