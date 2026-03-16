package handlers

import (
	"fnb-backend/models"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SMTPConfig holds the SMTP server configuration
type SMTPConfig struct {
	Host     string
	Port     string
	From     string
	Password string
}

// getSmtpConfig reads SMTP settings from environment variables
func getSmtpConfig() SMTPConfig {
	return SMTPConfig{
		Host:     getEnv("SMTP_HOST", "localhost"),
		Port:     getEnv("SMTP_PORT", "1025"),
		From:     getEnv("SMTP_FROM", "noreply@brewly.com"),
		Password: getEnv("SMTP_PASSWORD", ""),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// emailStrings holds all translatable strings for the email template
type emailStrings struct {
	Subject      string
	Subtitle     string
	Welcome      string
	ThankYou     string
	BrowseTitle  string
	BrowseDesc   string
	BestTitle    string
	BestDesc     string
	DelivTitle   string
	DelivDesc    string
	CtaButton    string
	Footer1      string
	Footer2      string
}

// getEmailStrings returns the correct translation based on lang
func getEmailStrings(name, lang string) emailStrings {
	if lang == "vi" {
		return emailStrings{
			Subject:      "Chào mừng đến Brewly, " + name + "! ☕",
			Subtitle:     "Thực phẩm & Đồ uống Cao cấp",
			Welcome:      "Chào mừng, " + name + "! 🎉",
			ThankYou:     "Cảm ơn bạn đã tham gia Brewly! Chúng tôi rất vui khi có bạn trong cộng đồng những người yêu thích ẩm thực và đồ uống.",
			BrowseTitle:  "🛒 Duyệt & Đặt hàng",
			BrowseDesc:   "Khám phá thực đơn cà phê thủ công, trà và bánh nướng tươi của chúng tôi.",
			BestTitle:    "⭐ Bán chạy nhất",
			BestDesc:     "Khám phá những sản phẩm phổ biến được hàng ngàn khách hàng yêu thích.",
			DelivTitle:   "🚚 Giao hàng miễn phí",
			DelivDesc:    "Miễn phí giao hàng cho tất cả đơn hàng — chất lượng đến tận nhà bạn.",
			CtaButton:    "Khám phá Thực đơn →",
			Footer1:      "© 2026 Brewly. Bảo lưu mọi quyền.",
			Footer2:      "Bạn nhận được email này vì bạn đã tạo tài khoản tại Brewly.",
		}
	}

	// Default: English
	return emailStrings{
		Subject:      "Welcome to Brewly, " + name + "! ☕",
		Subtitle:     "Premium Food & Beverages",
		Welcome:      "Welcome, " + name + "! 🎉",
		ThankYou:     "Thank you for joining Brewly! We're thrilled to have you as part of our community of food and beverage enthusiasts.",
		BrowseTitle:  "🛒 Browse & Order",
		BrowseDesc:   "Explore our curated menu of artisan coffee, teas, and freshly baked goods.",
		BestTitle:    "⭐ Best Sellers",
		BestDesc:     "Discover our most popular items loved by thousands of customers.",
		DelivTitle:   "🚚 Free Delivery",
		DelivDesc:    "Enjoy free delivery on all orders — quality delivered to your door.",
		CtaButton:    "Explore Menu →",
		Footer1:      "© 2026 Brewly. All rights reserved.",
		Footer2:      "You received this email because you created an account at Brewly.",
	}
}

// SendWelcomeEmail sends a styled HTML welcome email to the newly registered user.
// It runs asynchronously so it won't block the registration response.
// lang should be "en" or "vi".
func SendWelcomeEmail(name, email, lang string) {
	go func() {
		s := getEmailStrings(name, lang)
		htmlBody := buildWelcomeHTML(s)

		if err := sendEmail(email, s.Subject, htmlBody); err != nil {
			log.Printf("⚠️  Failed to send welcome email to %s: %v", email, err)
		} else {
			log.Printf("📧 Welcome email sent to %s (lang=%s)", email, lang)
		}
	}()
}

// buildWelcomeHTML returns a beautiful HTML email template using translated strings
func buildWelcomeHTML(s emailStrings) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a2e 0%%,#16213e 100%%);border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);">
              <h1 style="margin:0;font-size:32px;color:#e0a84e;letter-spacing:2px;">☕ BREWLY</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.5);font-size:13px;text-transform:uppercase;letter-spacing:3px;">%s</p>
            </td>
          </tr>
          
          <!-- Welcome Message -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#ffffff;font-size:24px;font-weight:600;">%s</h2>
              <p style="margin:0 0 24px;color:rgba(255,255,255,0.75);font-size:16px;line-height:1.6;">
                %s
              </p>
              
              <!-- Feature Cards -->
              <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:12px;background:rgba(224,168,78,0.1);border-radius:12px;border-left:4px solid #e0a84e;margin-bottom:12px;">
                    <p style="margin:0;color:#e0a84e;font-size:14px;font-weight:600;">%s</p>
                    <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">%s</p>
                  </td>
                </tr>
                <tr><td style="height:12px;"></td></tr>
                <tr>
                  <td style="padding:12px;background:rgba(224,168,78,0.1);border-radius:12px;border-left:4px solid #e0a84e;">
                    <p style="margin:0;color:#e0a84e;font-size:14px;font-weight:600;">%s</p>
                    <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">%s</p>
                  </td>
                </tr>
                <tr><td style="height:12px;"></td></tr>
                <tr>
                  <td style="padding:12px;background:rgba(224,168,78,0.1);border-radius:12px;border-left:4px solid #e0a84e;">
                    <p style="margin:0;color:#e0a84e;font-size:14px;font-weight:600;">%s</p>
                    <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">%s</p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                <tr>
                  <td align="center">
                    <a href="http://localhost:5173/#/products" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#e0a84e,#c4913a);color:#0f0f0f;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;letter-spacing:0.5px;">
                      %s
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:rgba(0,0,0,0.3);text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
              <p style="margin:0;color:rgba(255,255,255,0.4);font-size:12px;">
                %s<br>
                %s
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
		s.Subtitle,
		s.Welcome,
		s.ThankYou,
		s.BrowseTitle, s.BrowseDesc,
		s.BestTitle, s.BestDesc,
		s.DelivTitle, s.DelivDesc,
		s.CtaButton,
		s.Footer1,
		s.Footer2,
	)
}

// sendEmail sends an email synchronously (used by resend endpoint)
func sendEmail(to, subject, htmlBody string) error {
	cfg := getSmtpConfig()

	msg := strings.Join([]string{
		"From: Brewly <" + cfg.From + ">",
		"To: " + to,
		"Subject: " + subject,
		"MIME-Version: 1.0",
		"Content-Type: text/html; charset=\"UTF-8\"",
		"",
		htmlBody,
	}, "\r\n")

	addr := cfg.Host + ":" + cfg.Port

	if cfg.Password != "" {
		auth := smtp.PlainAuth("", cfg.From, cfg.Password, cfg.Host)
		return smtp.SendMail(addr, auth, cfg.From, []string{to}, []byte(msg))
	}
	return smtp.SendMail(addr, nil, cfg.From, []string{to}, []byte(msg))
}

// EmailHandler handles email-related API endpoints
type EmailHandler struct {
	DB *gorm.DB
}

func NewEmailHandler(db *gorm.DB) *EmailHandler {
	return &EmailHandler{DB: db}
}

// ResendWelcomeRequest is the JSON body for resend welcome email
type ResendWelcomeRequest struct {
	Lang string `json:"lang"`
}

// ResendWelcome re-sends the welcome email to the authenticated user
func (h *EmailHandler) ResendWelcome(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req ResendWelcomeRequest
	// Bind is optional — lang defaults to "en"
	c.ShouldBindJSON(&req)
	lang := req.Lang
	if lang == "" {
		lang = "en"
	}

	var user models.User
	if result := h.DB.First(&user, userID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	s := getEmailStrings(user.Name, lang)
	htmlBody := buildWelcomeHTML(s)

	if err := sendEmail(user.Email, s.Subject, htmlBody); err != nil {
		log.Printf("⚠️  Failed to resend welcome email to %s: %v", user.Email, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}

	log.Printf("📧 Welcome email resent to %s (lang=%s)", user.Email, lang)
	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome email sent successfully",
		"email":   user.Email,
		"lang":    lang,
	})
}
