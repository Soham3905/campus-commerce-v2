import { ALL_RULES } from "./rules";

/**
 * ==============================================================================
 * SDUI VALIDATOR SUITE
 * ==============================================================================
 * 
 * 🎓 Beginner Note: What is this file and why do we need it?
 * ------------------------------------------------------------------------------
 * Imagine an airport security checkpoint:
 * 1. The **Theme JSON** is the traveler (it carries data, styles, and children).
 * 2. The **Rule JSONs** (`src/sdui/validators/rules/*.json`) are the rulebook
 *    (e.g., "A ProductCard must have an ID", "A Title text cannot be 5,000 letters").
 * 3. This file (`validator.ts`) is the **Security Guard / Inspector**.
 *    It reads the rulebook and checks each component to ensure everything is safe,
 *    correctly positioned on the grid, and will not crash the website.
 * ==============================================================================
 */


// validator.ts
// does not render any buttons or images on the screen. Its only job is to read the rulebook, inspect incoming UI data, and answer:

// "Is this component valid?"
// "Are there any illegal children or broken grid coordinates?"
// "If someone put something invalid inside, can we safely clean it up so the website doesn't crash?"

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface SanitizedValidationResult {
  sanitizedSchema: any;
  isValid: boolean;
  errors: string[];
  removedComponents: string[];
}

// ==============================================================================
// 1. FIELD ALIAS DICTIONARY
// ==============================================================================
// In SDUI, backend developers and designers sometimes use different names for
// the same thing (e.g., 'text' vs 'title', 'price' vs 'sellingPrice').
// This lookup table allows the validator to find the value under common synonyms.
const FIELD_ALIASES: Record<string, string[]> = {
  text: ["title", "label", "count", "score", "tag"],
  title: ["text"],
  label: ["name", "text", "username"],
  name: ["label"],
  count: ["text"],
  score: ["text"],
  tag: ["text"],
  price: ["sellingPrice"],
  sellingPrice: ["price"],
  code: ["couponCode", "coupon"],
  couponCode: ["code", "coupon"],
  coupon: ["code", "couponCode"],
  targetDate: ["targetTime"],
  targetTime: ["targetDate"],
};

/**
 * Helper: Safely extracts a field value from node.data (or the node itself),
 * automatically falling back to common synonyms if the exact key isn't found.
 */
function getFieldValue(node: any, fieldName: string): any {
  if (!node) return undefined;

  // 1. Direct match in node.data or top-level node
  if (node.data?.[fieldName] !== undefined) return node.data[fieldName];
  if (node[fieldName] !== undefined) return node[fieldName];

  // 2. Check known aliases (e.g. text <-> title)
  const synonyms = FIELD_ALIASES[fieldName];
  if (synonyms && node.data) {
    for (const altKey of synonyms) {
      if (node.data[altKey] !== undefined) {
        return node.data[altKey];
      }
    }
  }

  return undefined;
}

// ==============================================================================
// 2. MODULAR VALIDATION CHECKS (Small, focused checker functions)
// ==============================================================================

/**
 * Check 1: 100-Column Responsive Grid Placement
 * Ensures mobile, tablet, and desktop coordinates stay within the 1-100 column bounds.
 */
export function validatePlacement(node: any, path: string, errors: string[]): void {
  if (!node.placement || typeof node.placement !== "object") return;

  const componentName = node.type || "Component";
  const devices = ["mobile", "tablet", "desktop"];

  // Ensure at least one viewport is defined
  const hasViewport = devices.some((d) => node.placement[d]);
  if (!hasViewport) {
    errors.push(
      `[${componentName} at ${path}] 'placement' must define at least one viewport ('mobile', 'tablet', or 'desktop').`
    );
    return;
  }

  devices.forEach((device) => {
    const coords = node.placement[device];
    if (!coords) return;

    const { colStart, colEnd, rowStart, rowEnd } = coords;

    // Check presence of all 4 coordinates
    if (colStart === undefined || colEnd === undefined || rowStart === undefined || rowEnd === undefined) {
      errors.push(
        `[${componentName} at ${path}] Placement for '${device}' must define colStart, colEnd, rowStart, and rowEnd.`
      );
      return;
    }

    // colStart: 1 to 100
    if (typeof colStart !== "number" || colStart < 1 || colStart > 100) {
      errors.push(
        `[${componentName} at ${path}] Placement '${device}.colStart' (${colStart}) must be an integer between 1 and 100.`
      );
    }

    // colEnd: greater than colStart and <= 101
    if (typeof colEnd !== "number" || colEnd <= colStart || colEnd > 101) {
      errors.push(
        `[${componentName} at ${path}] Placement '${device}.colEnd' (${colEnd}) must be greater than colStart (${colStart}) and at most 101.`
      );
    }

    // rowStart: >= 1
    if (typeof rowStart !== "number" || rowStart < 1) {
      errors.push(
        `[${componentName} at ${path}] Placement '${device}.rowStart' (${rowStart}) must be a positive integer >= 1.`
      );
    }

    // rowEnd: greater than rowStart
    if (typeof rowEnd !== "number" || rowEnd <= rowStart) {
      errors.push(
        `[${componentName} at ${path}] Placement '${device}.rowEnd' (${rowEnd}) must be greater than rowStart (${rowStart}).`
      );
    }
  });
}

/**
 * Check 2: Field Constraints (Data Types, String Length, Number Ranges)
 */
function checkFieldConstraints(node: any, rule: any, path: string, errors: string[]): void {
  if (!rule.fields || typeof rule.fields !== "object") return;
  const componentName = node.type || rule.type || "Component";

  Object.entries(rule.fields).forEach(([fieldName, constraint]: [string, any]) => {
    let val = getFieldValue(node, fieldName);
    if (val === undefined || val === null) return;

    // Auto-coerce numbers to string if expected type is string (e.g. count: 376 -> "376")
    if (constraint.type === "string" && typeof val === "number") {
      val = String(val);
    }

    // Type check
    if (constraint.type && typeof val !== constraint.type) {
      errors.push(
        `[${componentName} at ${path}] Field '${fieldName}' must be of type '${constraint.type}', but received '${typeof val}'.`
      );
    }

    // Min / Max length for strings
    if (typeof val === "string") {
      if (constraint.minLength !== undefined && val.length < constraint.minLength) {
        errors.push(
          `[${componentName} at ${path}] Field '${fieldName}' ("${val}") is shorter than minLength (${constraint.minLength}).`
        );
      }
      if (constraint.maxLength !== undefined && val.length > constraint.maxLength) {
        errors.push(
          `[${componentName} at ${path}] Field '${fieldName}' length (${val.length}) exceeds maxLength (${constraint.maxLength}).`
        );
      }
    }

    // Min / Max value for numbers
    if (typeof val === "number") {
      if (constraint.min !== undefined && val < constraint.min) {
        errors.push(
          `[${componentName} at ${path}] Field '${fieldName}' (${val}) is less than minimum allowed (${constraint.min}).`
        );
      }
      if (constraint.max !== undefined && val > constraint.max) {
        errors.push(
          `[${componentName} at ${path}] Field '${fieldName}' (${val}) exceeds maximum allowed (${constraint.max}).`
        );
      }
    }
  });
}

/**
 * Check 3: Required Data Fields (e.g., ProductCard requires 'id')
 */
function checkRequiredFields(node: any, rule: any, path: string, errors: string[]): void {
  if (!Array.isArray(rule.requiredDataFields)) return;
  const componentName = node.type || rule.type || "Component";

  rule.requiredDataFields.forEach((field: string) => {
    const val = getFieldValue(node, field);
    if (val === undefined || val === null || val === "") {
      errors.push(`[${componentName} at ${path}] Missing required data field: '${field}'.`);
    }
  });
}

/**
 * Check 4: Child Counts & Allowed Child Types
 */
function checkChildConstraints(node: any, rule: any, path: string, errors: string[]): void {
  const componentName = node.type || rule.type || "Component";
  const childCount = Array.isArray(node.children) ? node.children.length : 0;

  // 1. Min and Max child counts
  if (rule.minValue !== undefined && rule.minValue > 0 && childCount < rule.minValue) {
    errors.push(
      `[${componentName} at ${path}] Has ${childCount} children, but requires at least ${rule.minValue}.`
    );
  }
  if (rule.maxValue !== undefined && rule.maxValue > 0 && childCount > rule.maxValue) {
    errors.push(
      `[${componentName} at ${path}] Has ${childCount} children, but maximum allowed is ${rule.maxValue}.`
    );
  }

  // 2. Allowed component types
  if (Array.isArray(rule.allowedComponents)) {
    // If allowedComponents is [], this is a leaf component and cannot have children
    if (rule.allowedComponents.length === 0 && childCount > 0) {
      errors.push(
        `[${componentName} at ${path}] Leaf component '${componentName}' does not permit children, but has ${childCount} children.`
      );
    } else if (rule.allowedComponents.length > 0 && !rule.allowedComponents.includes("*") && Array.isArray(node.children)) {
      node.children.forEach((child: any, idx: number) => {
        if (child.type && !rule.allowedComponents.includes(child.type)) {
          errors.push(
            `[${componentName} at ${path}] Child '${child.type}' at index ${idx} is not allowed. Allowed types: [${rule.allowedComponents.join(", ")}].`
          );
        }
      });
    }
  }
}

/**
 * Check 5: Allowed Action Triggers (e.g. onTap, onSwipe)
 */
function checkAllowedActions(node: any, rule: any, path: string, errors: string[]): void {
  if (!Array.isArray(rule.allowedActions) || rule.allowedActions.length === 0 || !node.actions) return;
  const componentName = node.type || rule.type || "Component";

  Object.keys(node.actions).forEach((trigger) => {
    if (!rule.allowedActions.includes(trigger)) {
      errors.push(
        `[${componentName} at ${path}] Action trigger '${trigger}' is not allowed. Allowed actions: [${rule.allowedActions.join(", ")}].`
      );
    }
  });
}

/**
 * Validates a single node against a rule definition.
 */
function validateSingleNode(node: any, rule: any, path: string, errors: string[]): void {
  // A. Check 100-Column Grid Placement (if present)
  if (node.placement) {
    validatePlacement(node, path, errors);
  }

  // B. Check field constraints (types, minLength, maxLength)
  checkFieldConstraints(node, rule, path, errors);

  // C. Check required data fields
  checkRequiredFields(node, rule, path, errors);

  // D. Check children count & whitelist of allowed child types
  checkChildConstraints(node, rule, path, errors);

  // E. Check action triggers
  checkAllowedActions(node, rule, path, errors);
}

// ==============================================================================
// 3. MAIN EXPORTED FUNCTIONS
// ==============================================================================

/**
 * Function 1: Universal 2-Parameter Validator
 * Checks an SDUI node or tree against a specific validation rule JSON.
 *
 * Example:
 * const result = validate(productCardJson, productCardRule);
 * if (!result.isValid) console.log(result.errors);
 */
export function validate(themeJson: any, validatorJson: any): ValidationResult {
  const errors: string[] = [];

  if (!themeJson || typeof themeJson !== "object") {
    return { isValid: false, errors: ["Invalid theme JSON: Input must be an object."] };
  }
  if (!validatorJson || typeof validatorJson !== "object") {
    return { isValid: false, errors: ["Invalid validator JSON: Validator rule must be an object."] };
  }

  // Unwrap { config: { ... } } if a preset wrapper is passed
  const rootNode = themeJson.config ? themeJson.config : themeJson;
  const targetType = validatorJson.type;
  let matchFound = false;

  // Walk through the tree to find all matching nodes
  function traverse(node: any, path: string = "root") {
    if (!node || typeof node !== "object") return;

    if (!targetType || node.type === targetType) {
      matchFound = true;
      validateSingleNode(node, validatorJson, path, errors);
    }

    if (Array.isArray(node.children)) {
      node.children.forEach((child: any, idx: number) => {
        traverse(child, `${path}.children[${idx}](${child.type || "Unknown"})`);
      });
    }
  }

  traverse(rootNode);

  if (targetType && !matchFound) {
    errors.push(`Target component '${targetType}' was not found in the provided theme JSON.`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Function 2: Full Tree Validator
 * Automatically inspects EVERY component in an entire page tree against ALL 35 rules!
 */
export function validateFullTree(treeJson: any): ValidationResult {
  const allErrors: string[] = [];

  function walk(node: any, path: string = "root") {
    if (!node || typeof node !== "object") return;

    // Validate placement
    if (node.placement) {
      validatePlacement(node, path, allErrors);
    }

    // Validate node against its rule if one exists
    if (node.type && ALL_RULES[node.type]) {
      const res = validate(node, ALL_RULES[node.type]);
      if (!res.isValid) {
        allErrors.push(...res.errors);
      }
    }

    // Walk children
    if (Array.isArray(node.children)) {
      node.children.forEach((child: any, idx: number) => {
        walk(child, `${path}.children[${idx}]`);
      });
    }
  }

  const root = treeJson.config ? treeJson.config : treeJson;
  walk(root);

  return { isValid: allErrors.length === 0, errors: allErrors };
}

/**
 * Function 3: Runtime Security Guard (Sanitizer)
 * If an untrusted theme or bad backend data contains illegal children
 * (e.g. an unknown tag or a countdown timer placed inside a button),
 * this function removes the suspicious component so the website never crashes!
 */
export function validateAndSanitize(treeJson: any): SanitizedValidationResult {
  const errors: string[] = [];
  const removedComponents: string[] = [];

  if (!treeJson || typeof treeJson !== "object") {
    return {
      sanitizedSchema: treeJson,
      isValid: false,
      errors: ["Invalid schema: Input must be a valid JSON object."],
      removedComponents: []
    };
  }

  // Clone to avoid mutating original schema
  const cleanTree = JSON.parse(JSON.stringify(treeJson));
  const rootNode = cleanTree.config ? cleanTree.config : cleanTree;

  function sanitizeNode(node: any, path: string = "root") {
    if (!node || typeof node !== "object") return;

    const componentName = node.type || "Component";
    const rule = ALL_RULES[node.type];

    // Validate placement
    if (node.placement) {
      validatePlacement(node, path, errors);
    }

    // Sanitize children against the parent's allowedComponents rule
    if (Array.isArray(node.children)) {
      const allowed = rule?.allowedComponents;

      node.children = node.children.filter((child: any, idx: number) => {
        if (!child || typeof child !== "object") return false;
        const childType = child.type;

        // Step 1: Is this component registered?
        if (childType && !ALL_RULES[childType]) {
          const msg = `[Suspicious Component Removed] Unknown component '${childType}' at ${path}.children[${idx}].`;
          errors.push(msg);
          removedComponents.push(`${childType} (Unknown Component)`);
          return false;
        }

        // Step 2: Does the parent rule permit this child?
        if (Array.isArray(allowed)) {
          if (allowed.length === 0) {
            const msg = `[Disallowed Child Removed] '${componentName}' does not permit children, but found '${childType}' at ${path}.children[${idx}].`;
            errors.push(msg);
            removedComponents.push(`${childType} (Not allowed in ${componentName})`);
            return false;
          }

          if (!allowed.includes("*") && !allowed.includes(childType)) {
            const msg = `[Disallowed Child Removed] '${childType}' is not allowed inside '${componentName}'. Allowed: [${allowed.join(", ")}].`;
            errors.push(msg);
            removedComponents.push(`${childType} (Not allowed in ${componentName})`);
            return false;
          }
        }

        // Step 3: Validate child's data against its own rule
        const childRule = ALL_RULES[childType];
        if (childRule) {
          // If child container has too many items, trim the extras
          if (Array.isArray(child.children) && childRule.maxValue && child.children.length > childRule.maxValue) {
            const excess = child.children.length - childRule.maxValue;
            child.children = child.children.slice(0, childRule.maxValue);
            errors.push(`[Excess Children Trimmed] '${childType}' exceeded maxValue (${childRule.maxValue}). Trimmed ${excess} children.`);
          }

          const validation = validate(child, childRule);
          if (!validation.isValid) {
            const reason = validation.errors[0];
            errors.push(`[Invalid Data Removed] '${childType}' at ${path}.children[${idx}]: ${reason}`);
            removedComponents.push(`${childType} (${reason})`);
            return false;
          }
        }

        return true;
      });

      // Step 4: Trim excess children if node exceeds its own maxValue
      if (rule?.maxValue !== undefined && rule.maxValue > 0 && node.children.length > rule.maxValue) {
        const excess = node.children.length - rule.maxValue;
        node.children = node.children.slice(0, rule.maxValue);
        errors.push(`[Excess Children Trimmed] '${componentName}' exceeded maxValue (${rule.maxValue}). Trimmed ${excess} children.`);
        removedComponents.push(`${excess} excess children of ${componentName}`);
      }

      // Recursively sanitize all surviving children
      node.children.forEach((child: any, idx: number) => {
        sanitizeNode(child, `${path}.children[${idx}](${child.type || "Unknown"})`);
      });
    }
  }

  sanitizeNode(rootNode);

  return {
    sanitizedSchema: cleanTree,
    isValid: errors.length === 0,
    errors,
    removedComponents
  };
}

export default validate;
