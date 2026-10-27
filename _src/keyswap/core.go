package main

// The text tools run the website's own JavaScript (js/core.js, generated from
// daidaiphasa.com) inside goja, so KeySwap gives exactly the same results as the site.

import (
	_ "embed"
	"fmt"

	"github.com/dop251/goja"
)

//go:embed js/core.js
var coreJS string

type engine struct {
	vm  *goja.Runtime
	fns map[string]goja.Callable
}

func newEngine() (*engine, error) {
	vm := goja.New()
	if _, err := vm.RunString(coreJS); err != nil {
		return nil, err
	}
	ks := vm.Get("KS").ToObject(vm)
	e := &engine{vm: vm, fns: map[string]goja.Callable{}}
	for _, name := range []string{"swap", "braille", "morse", "romanize"} {
		fn, ok := goja.AssertFunction(ks.Get(name))
		if !ok {
			return nil, fmt.Errorf("KS.%s missing", name)
		}
		e.fns[name] = fn
	}
	return e, nil
}

// Run converts text with one of: swap, braille, morse, romanize.
func (e *engine) Run(mode, text string) (string, error) {
	fn, ok := e.fns[mode]
	if !ok {
		return "", fmt.Errorf("unknown mode %q", mode)
	}
	v, err := fn(goja.Undefined(), e.vm.ToValue(text))
	if err != nil {
		return "", err
	}
	return v.String(), nil
}
