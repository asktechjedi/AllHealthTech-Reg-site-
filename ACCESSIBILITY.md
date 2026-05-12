# Accessibility Guidelines

## WCAG 2.1 AA Compliance

This application aims to meet WCAG 2.1 Level AA standards for accessibility.

## Implemented Accessibility Features

### 1. Semantic HTML & ARIA

#### Form Structure
- ✅ **Semantic form elements**: `<form>`, `<fieldset>`, `<legend>`, `<label>`
- ✅ **Proper heading hierarchy**: H1 → H2 → H3 (no skipped levels)
- ✅ **ARIA labels**: All form fields have associated labels
- ✅ **ARIA required**: Required fields marked with `aria-required="true"`
- ✅ **ARIA invalid**: Invalid fields marked with `aria-invalid="true"`
- ✅ **ARIA describedby**: Error messages linked to fields
- ✅ **ARIA live regions**: Error messages announced with `aria-live="polite"` or `aria-live="assertive"`
- ✅ **ARIA busy**: Loading states indicated with `aria-busy="true"`

#### Form Labels
- ✅ All inputs have explicit `<label>` elements with `htmlFor` attribute
- ✅ Required fields indicated with asterisk (*) and `aria-label="required"`
- ✅ Optional fields indicated with `aria-required="false"`

#### Error Handling
- ✅ Inline error messages with `role="alert"`
- ✅ Error messages linked to fields via `aria-describedby`
- ✅ General errors announced with `aria-live="assertive"`
- ✅ Field-specific errors announced with `aria-live="polite"`

### 2. Keyboard Navigation

#### Focus Management
- ✅ **Visible focus indicators**: 2px solid outline with offset
- ✅ **Logical tab order**: Follows visual layout
- ✅ **No keyboard traps**: All interactive elements can be exited
- ✅ **Skip to content link**: Allows skipping navigation (when implemented)

#### Interactive Elements
- ✅ All buttons keyboard accessible
- ✅ All form fields keyboard accessible
- ✅ Enter key submits form
- ✅ Tab/Shift+Tab navigation works correctly

### 3. Visual Design

#### Color Contrast
- ✅ **Text contrast**: Minimum 4.5:1 for normal text
- ✅ **Large text contrast**: Minimum 3:1 for large text (18pt+)
- ✅ **UI component contrast**: Minimum 3:1 for interactive elements
- ✅ **Focus indicators**: High contrast (brand blue #2200ff)

#### Typography
- ✅ **Font size**: Minimum 14px (0.875rem) for body text
- ✅ **Line height**: 1.5 for body text
- ✅ **Font family**: Inter (highly legible sans-serif)
- ✅ **Text spacing**: Adequate spacing between lines and paragraphs

#### Visual Indicators
- ✅ **Required fields**: Marked with asterisk (*) and color
- ✅ **Error states**: Red border + red text + icon
- ✅ **Loading states**: Spinner + text change
- ✅ **Disabled states**: Reduced opacity + cursor change

### 4. Screen Reader Support

#### Announcements
- ✅ **Form submission**: Loading state announced
- ✅ **Errors**: Error messages announced immediately
- ✅ **Success**: Success message announced on navigation
- ✅ **Field changes**: Errors cleared when user corrects

#### Content Structure
- ✅ **Landmarks**: Form has proper landmark roles
- ✅ **Headings**: Proper heading structure for navigation
- ✅ **Lists**: Proper list markup where applicable
- ✅ **Tables**: Proper table markup with headers (if used)

### 5. Form Accessibility

#### Input Fields
- ✅ **Autocomplete**: Appropriate autocomplete attributes
- ✅ **Input types**: Correct input types (email, tel, text)
- ✅ **Placeholders**: Not used as labels (labels always present)
- ✅ **Help text**: Additional context provided where needed

#### Validation
- ✅ **Client-side validation**: Immediate feedback
- ✅ **Server-side validation**: Backend validation as backup
- ✅ **Error prevention**: Clear instructions and examples
- ✅ **Error recovery**: Clear error messages with guidance

## Testing Checklist

### Keyboard Navigation Testing

- [ ] **Tab through all interactive elements**
  - All buttons, links, and form fields should be reachable
  - Tab order should follow visual layout
  - Focus indicators should be clearly visible

- [ ] **Test form submission with keyboard**
  - Enter key should submit form when focus is on submit button
  - Enter key in text fields should submit form

- [ ] **Test error handling with keyboard**
  - Errors should be announced
  - Focus should remain on or move to first error field
  - Errors should be clearable via keyboard

### Screen Reader Testing

#### NVDA (Windows - Free)
- [ ] Navigate form with Tab/Shift+Tab
- [ ] Verify all labels are announced
- [ ] Verify required fields are announced as required
- [ ] Verify error messages are announced
- [ ] Verify loading states are announced
- [ ] Test form submission flow

#### JAWS (Windows - Commercial)
- [ ] Same tests as NVDA
- [ ] Verify forms mode works correctly
- [ ] Verify virtual cursor navigation

#### VoiceOver (macOS/iOS - Built-in)
- [ ] Navigate with VO+Right Arrow
- [ ] Verify rotor navigation (VO+U)
- [ ] Test form submission
- [ ] Verify announcements

#### TalkBack (Android - Built-in)
- [ ] Navigate with swipe gestures
- [ ] Verify all elements are announced
- [ ] Test form submission

### Visual Testing

- [ ] **Zoom to 200%**
  - Content should remain readable
  - No horizontal scrolling required
  - All functionality should remain available

- [ ] **Test with high contrast mode**
  - Windows High Contrast
  - macOS Increase Contrast

- [ ] **Test with reduced motion**
  - Animations should be reduced or removed
  - `prefers-reduced-motion` media query

- [ ] **Test color blindness**
  - Use browser extensions or tools
  - Verify information not conveyed by color alone

### Browser Testing

- [ ] Chrome + NVDA
- [ ] Firefox + NVDA
- [ ] Edge + NVDA
- [ ] Safari + VoiceOver
- [ ] Mobile Safari + VoiceOver
- [ ] Chrome Android + TalkBack

## Known Limitations

### Manual Testing Required

Full WCAG 2.1 AA compliance requires manual testing with:
- Real screen readers
- Real users with disabilities
- Accessibility experts
- Automated tools (axe, WAVE, Lighthouse)

### Areas Requiring Expert Review

- [ ] **Color contrast**: Verify all color combinations meet WCAG standards
- [ ] **Focus order**: Verify tab order is logical in all scenarios
- [ ] **Screen reader announcements**: Verify all content is properly announced
- [ ] **Keyboard shortcuts**: Verify no conflicts with assistive technology
- [ ] **Touch targets**: Verify minimum 44x44px touch targets on mobile

## Automated Testing

### Tools

1. **axe DevTools** (Browser Extension)
   - Install: [Chrome](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)
   - Run on registration page
   - Fix all critical and serious issues

2. **Lighthouse** (Built into Chrome DevTools)
   - Run accessibility audit
   - Aim for 90+ score
   - Address all flagged issues

3. **WAVE** (Browser Extension)
   - Install: [Chrome](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/wave-accessibility-tool/)
   - Check for errors and alerts
   - Review contrast issues

### Running Tests

```bash
# Install axe-core for automated testing
npm install --save-dev @axe-core/cli

# Run axe on local development server
npx axe http://localhost:5173/registration --save results.json

# Review results
cat results.json
```

## Continuous Improvement

### Regular Audits

- Run automated tests before each release
- Conduct manual testing quarterly
- User testing with people with disabilities annually
- Stay updated with WCAG guidelines

### Feedback

- Provide accessibility feedback form
- Monitor user reports of accessibility issues
- Prioritize accessibility fixes

### Training

- Train developers on accessibility best practices
- Review accessibility in code reviews
- Include accessibility in definition of done

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Inclusive Components](https://inclusive-components.design/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

## Contact

For accessibility issues or questions, contact: accessibility@allhealthtech.com
