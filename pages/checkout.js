export default function Checkout() {
  return (
    <div style={{padding:"40px"}}>
      <h1>Test Payment</h1>

      <form>
        <input placeholder="Full Name" /><br/><br/>
        <input placeholder="Card Number" /><br/><br/>
        <input placeholder="Expiry Date" /><br/><br/>

        <button>Pay (Test)</button>
      </form>
    </div>
  );
}