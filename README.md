# shelf.

**De-cluttering and de-influencing**

The skincare industry has shifted from "self-care" to "shelf-care," a culture of overconsumption fueled by viral skincare trends. Many of us own twenty products but only have one face. We wanted to build a tool that empowers users to de-influence themselves, focusing on ingredient integrity rather than brand hype.

## What it does

Skincare is shrouded in marketing and complex chemistry. Most consumers don't know that their expensive "Hydrating Serum" and their "Soothing Toner" might share the same primary active ingredients (like Glycerin or Hyaluronic Acid). This leads to:
- Using multiple overlapping products that do the exact same thing
- Buying "new" innovations and wasting money on old formulas in new bottles.
- Overtreating the skin by accidentally layering unintended active ingredients.

shelf. is an intelligent skincare auditor that decodes your regimen. By analyzing the chemical composition of your products, it transforms a cluttered bathroom vanity into a simple complete routine

Features:
- We translate enigmatic chemical names into plain English. The app categorizes ingredients by their functional purpose (e.g., humectants, exfoliants, antioxidants).
- Before you buy that new viral cream, shelf. scans the ingredients. If you already own a product with similar ingredients or the same primary function, the app warns you of the redundant buy.
- Instead of suggesting more products, shelf. identifies what your routine is actually missing (e.g., "You have three hydrators, but no SPF").

## How we built it

The backbone of shelf. is a comprehensive mapping of cosmetic chemistry. We began by curating an exhaustive dataset of skincare ingredients, which we then built into a relational model within Snowflake DB.

Snowflake DB was invaluable in this process as it provided a space to store and map out all these relationships. Each ingredient was classified into its functional families (e.g., mapping Tocopherol and Emollients to Moisturizing Agents). This allowed us to create a logic engine that can identify functional duplicates, products that look different on the label but perform the same task on the skin.

## Challenges we ran into

Our biggest hurdle was data acquisition. We initially aimed to build a pre-populated database of every skincare product on the market, but inconsistent formatting across e-commerce sites made traditional web scraping very difficult.

To overcome the lack of data we shifted to a vision first approach. We leveraged Gemini OCR to analyze product labels in real-time. This allowed us to identify and qualify products on the fly from a simple smartphone photo, bypassing the need for a perfect, pre-existing database.

## Accomplishments that we're proud of

The Digital Vanity: We built an interactive shelf using Three.js and WebGL. Users don't just look at a list; they see their products rendered as 3D objects in a virtual space.

The Clarity Engine: Successfully mapping multi-layered relationships between raw ingredients, their specific use cases (e.g., acne-fighting vs. hydrating), and their compatibility with different skin types.

## What we learned

Cloud Data Warehousing: Gained hands-on experience with Snowflake DB for managing complex, multi-layered relational data.
Computer Vision: Learned to implement and fine-tune Gemini OCR to extract structured text from curved, reflective surfaces (like cosmetic bottles).
3D Web Rendering: Strong understanding in Three.js to create a premium user experience.

## What's next for shelf.

Smart Replacements: Instead of just suggesting "you need a Vitamin C," shelf. will suggest the specific, best-value product tailored to your existing routine.

Conflict Detection: Adding "Routine Safety" alerts to warn users if they are mixing ingredients that shouldn't go together (like Retinol and AHA acids).

Community De-influencing: A social feature where users can share their Minimalist Shelves to inspire others to buy less and use better.
