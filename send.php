<?php

// ---------- BASIC SPAM PROTECTION (honeypot) ----------
if (!empty($_POST["honeypot"])) {
    die("Spam detected.");
}

// ---------- GET FORM DATA ----------
$name    = htmlspecialchars($_POST["name"]);
$email   = htmlspecialchars($_POST["email"]);
$message = htmlspecialchars($_POST["message"]);

// ---------- YOUR EMAIL (where messages will come) ----------
$to = "jigneshthacker03@gmail.com";   // ← CHANGE THIS ONLY

$subject = "New Portfolio Contact Message";

// ---------- EMAIL BODY ----------
$body  = "Name: $name\n";
$body .= "Email: $email\n\n";
$body .= "Message:\n$message\n";

// ---------- EMAIL HEADERS ----------
$headers  = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// ---------- SEND EMAIL ----------
if (mail($to, $subject, $body, $headers)) {

    // Success popup + redirect back to website
    echo "<script>
            alert('📩 Your message was sent successfully!');
            window.location.href = 'index.html';
          </script>";

} else {

    echo "<script>
            alert('❌ Failed to send message. Try again later.');
            window.location.href = 'index.html';
          </script>";
}
?>
